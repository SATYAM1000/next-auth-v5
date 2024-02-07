/** @format */

import React from "react";

const AuthLayoutPage = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="h-full flex items-center justify-center bg-slate-900 text-white">
			{children}
		</div>
	);
};

export default AuthLayoutPage;
