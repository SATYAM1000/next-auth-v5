/** @format */

import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findUnique({
			where: { token },
		});
	} catch (error) {
		return null;
	}
};

export const getTwoFactorTokenByEmail = async (email: string) => {
	try {
		const twoFactorToken = await db.twoFactorToken.findFirst({
			where: { email },
		});
	} catch (error) {
		return null;
	}
};
