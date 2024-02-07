/** @format */

import { UserInfo } from "@/components/user-info";
import { currentUser } from "@/lib/auth";
const ServerPage = async () => {
	const user:any = await currentUser();
    console.log("server user is ", user);
	return <UserInfo  user={user} label=" 💻 Server component" />;
};

export default ServerPage;
