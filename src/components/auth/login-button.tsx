/** @format */

"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
	children: React.ReactNode;
	mode?: "modal" | "redirect";
	asChild?: boolean;
}

export const LoginButton = ({
	children,
	mode = "redirect",
	asChild,
}: LoginButtonProps) => {
	const router = useRouter();

	const onButtonClick = () => {
		router.push("/auth/login");
	};
	if (mode === "modal") {
		return <span className="text-white">TODO:Implement modal</span>;
	}

	return (
		<span className="cursor-pointer" onClick={onButtonClick}>
			{children}
		</span>
	);
};
