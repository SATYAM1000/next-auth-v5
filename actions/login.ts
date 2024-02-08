/** @format */

"use server";
import * as z from "zod";
import { LoginSchema } from "../schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "../data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "../data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "../data/two-factor-confirmation";
export const login = async (
	values: z.infer<typeof LoginSchema>,
	callbackUrl?: string
) => {
	const validatedFields = LoginSchema.safeParse(values);
	if (!validatedFields.success) {
		return { error: "Invalid fields!" };
	}

	const { email, password, code } = validatedFields.data;
	const existingUser = await getUserByEmail(email);
	if (!existingUser || !existingUser.email || !existingUser.password) {
		return {
			error: "Email does not exist!",
		};
	}
	if (!existingUser.emailVerified) {
		const verificationToken = await generateVerificationToken(
			existingUser.email
		);
		await sendVerificationEmail(
			verificationToken.email,
			verificationToken.token
		);
		return { success: "Confirmation email sent!" };
	}

	if (existingUser.isTwoFactorEnables && existingUser.email) {
		if (code) {
			const twoFactorToken: any = await getTwoFactorTokenByEmail(
				existingUser.email
			);
			if (!twoFactorToken) {
				console.log("error 1");
				return { error: "Invalid code!" };
			}

			if (twoFactorToken.token !== code) {
				console.log("error 2");
				return { error: "Invalid code!" };
			}
			const hasExpired = new Date(twoFactorToken.expires) < new Date();

			if (hasExpired) {
				return { error: "Code expired!" };
			}

			await db.twoFactorToken.delete({
				where: { id: twoFactorToken.id },
			});

			const existingConfirmation: any = await getTwoFactorConfirmationByUserId(
				existingUser.id
			);

			if (existingUser) {
				await db.twoFactorConfirmation.delete({
					where: { id: existingConfirmation.id },
				});
			}

			await db.twoFactorConfirmation.create({
				data: {
					userId: existingUser.id,
				},
			});
		} else {
			const twoFactorToken = await generateTwoFactorToken(existingUser.email);
			await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
			return { twoFactor: true };
		}
	}

	try {
		await signIn("credentials", {
			email,
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
		});
	} catch (error: any) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case "CredentialsSignin":
					return { error: "Invalid credentials!" };
				default:
					return { error: "Something went wrong!" };
			}
		}

		throw error;
	}
};
