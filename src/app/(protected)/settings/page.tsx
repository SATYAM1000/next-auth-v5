/** @format */
"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { settings } from "../../../../actions/settings";
import { useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingSchema } from "../../../../schemas";
import { Switch } from "@/components/ui/switch";
import {
	Form,
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "../../../../hooks/use-current-user";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";

const SettingsPage = () => {
	const user = useCurrentUser();

	const [error, setError] = useState<string | undefined>();

	const [success, setSuccess] = useState<string | undefined>();

	const { update } = useSession();
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof SettingSchema>>({
		resolver: zodResolver(SettingSchema),
		defaultValues: {
			name: user?.name || undefined,
			email: user?.email || undefined,
			password: undefined,
			newPassword: undefined,
			role: user?.role || undefined,
		},
	});

	const onSubmit = (values: z.infer<typeof SettingSchema>) => {
		startTransition(() => {
			settings(values)
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}
					if (data.success) {
						update();
						setSuccess(data.success);
					}
				})
				.catch(() => {
					setError("Something went wrong");
				});
		});
	};
	return (
		<Card className="w-[600px] ">
			<CardHeader>
				<p className="text-xl font-semibold text-center">⚙️ Settings</p>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder="Jon Doe"
												disabled={isPending}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{user?.isOAuth === false && (
								<>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="john.doe@gmail.com"
														disabled={isPending}
														type="email"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="******"
														disabled={isPending}
														type="password"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="newPassword"
										render={({ field }) => (
											<FormItem>
												<FormLabel>New Password</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="******"
														disabled={isPending}
														type="password"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</>
							)}

							<FormField
								control={form.control}
								name="role"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Role</FormLabel>
										<Select
											disabled={isPending}
											onValueChange={field.onChange}
											defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a role" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
												<SelectItem value={UserRole.USER}>User</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isTwoFactorEnabled"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="space-y-0.5">
											<FormLabel>Two Factor Authentication</FormLabel>
											<FormDescription>
												Enable two factor authentication for your account
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												disabled={isPending}
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<FormError message={error} />
						<FormSuccess message={success} />
						<Button type="submit" disabled={isPending}>
							Save
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SettingsPage;

// ----------------------------------------

//----------getting session data for server component------

// import { auth } from "@/auth";
// import React from "react";
// import { signOut } from "@/auth";

// const SettingsPage = async () => {
// 	const session = await auth();
// 	console.log("your session is ", session);

// 	return (
// 		<div>
// 			{JSON.stringify(session)}
// 			<form
// 				action={async () => {
// 					"use server";
// 					await signOut();
// 				}}>
// 				<button
// 					className="px-3 py-2 bg-blue-500 rounded text-white active:bg-blue-900"
// 					type="submit">
// 					Sign out
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default SettingsPage;
