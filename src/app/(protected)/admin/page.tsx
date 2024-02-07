/** @format */

"use client";
import { currentRole } from "@/lib/auth";
import { useCurrentRole } from "../../../../hooks/use-current-role";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/auth/rle-gate";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";

const AdminPage = () => {
	return (
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-xl font-semibold text-center">🔑 Admin</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message="You are allowed to see this content!" />
				</RoleGate>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">Admin-only API Route</p>
                    <Button>
                        Click to test
                    </Button>
				</div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">Admin-only Server Action</p>
                    <Button>
                        Click to test
                    </Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminPage;
