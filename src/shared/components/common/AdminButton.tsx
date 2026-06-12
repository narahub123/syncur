"use client";

import { Shield } from "lucide-react";
import ResponsiveActionButton from "./ResponsiveActionButton";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useSession } from "next-auth/react";

const AdminButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const isAdmin = session?.user.role === "admin";

  if (!isAdmin) return null;

  return (
    <ResponsiveActionButton
      icon={<Shield className="size-5" />}
      label="관리자"
      onClick={() => router.push(ROUTES.ADMIN_DASHBOARD)}
    />
  );
};

export default AdminButton;
