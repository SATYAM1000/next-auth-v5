/** @format */

import { DividerHorizontalIcon } from "@radix-ui/react-icons";
import { Navbar } from "./_components/navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="min-h-screen w-full py-12 flex flex-col gap-y-10 items-center justify-center bg-slate-900">
			<Navbar />
			{children}
		</div>
	);
};

export default ProtectedLayout;
