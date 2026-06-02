"use client";

import Button from "@/shared/components/ui/Button";
import { ROUTES } from "@/shared/constants/routes";
import { signOut } from "next-auth/react";

const LogoutButton = () => {
  const handleClick = async () => {
    try {
      await signOut({ redirectTo: ROUTES.HOME });
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };
  return (
    <Button
      onClick={handleClick}
      type="button"
      title="로그아웃"
      variant="outline"
    >
      로그아웃
    </Button>
  );
};

export default LogoutButton;
