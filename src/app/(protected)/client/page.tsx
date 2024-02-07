/** @format */
"use client";
import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "../../../../hooks/use-current-user";
const ClientPage = () => {
	console.log("welcome to client page");
	const user = useCurrentUser();
	console.log("client user is ", user);
    console.log("client two enabled or not ", user?.isTwoFactorEnabled);
	return <UserInfo user={user} label=" 💻 Client component" />;
};

export default ClientPage;
