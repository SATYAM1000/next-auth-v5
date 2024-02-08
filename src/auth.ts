/** @format */

import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserByEmail, getUserById } from "../data/user";
import { getTwoFactorConfirmationByUserId } from "../data/two-factor-confirmation";
import { getAccountByUserId } from "../data/account";
type ExtendedUser = DefaultSession["user"] & {
	role: "ADMIN" | "USER";
	isTwoFactorEnabled: boolean;
	isOAuth: boolean;
};
declare module "next-auth" {
	interface Session {
		user: ExtendedUser;
	}
}

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			//Allow OAuth without email verification
			if (account?.provider !== "credentials") return true;

			const existingUser = await getUserById(user.id!);

			//prevent signIn without email verification
			if (!existingUser?.emailVerified) {
				return false;
			}

			if (existingUser.isTwoFactorEnables) {
				const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
					existingUser.id
				);
				if (!twoFactorConfirmation) return false;

				//delete two factor confirmation for next sign in
				await db.twoFactorConfirmation.delete({
					where: { id: twoFactorConfirmation.id },
				});
			}

			return true;
		},
		async session({ token, session }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			if (session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
			}

			//important while updating session data

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async jwt({ token, user, profile }) {
			console.log("I AM BEING CALLD AGAIN!");
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);
			if (!existingUser) {
				return token;
			}
			const existingAccount = await getAccountByUserId(existingUser.id);
			token.isOAuth = !!existingAccount;

			//important while updating
			token;
			token.name = existingUser.name;
			token.email = existingUser.email;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnables;

			return token;
		},
	},
	adapter: PrismaAdapter(db),
	session: { strategy: "jwt" },
	...authConfig,
});
