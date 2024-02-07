/** @format */
import { auth } from "@/auth";
import React from "react";
import { signOut } from "@/auth";

const SettingsPage = async () => {
	const session = await auth();
	console.log("your session is ", session);

	return (
		<div>
			{JSON.stringify(session)}
			<form
				action={async () => {
					"use server";
					await signOut();
				}}>
				<button className="px-3 py-2 bg-blue-500 rounded text-white active:bg-blue-900" type="submit">Sign out</button>
			</form>
		</div>
	);
};

export default SettingsPage;
