"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

import UserMenu from "./UserMenu";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/shared/constants/routes";
import { useRouter } from "next/navigation";

const UserMenuDropdown = () => {
  const router = useRouter();

  const handleSettingClick = () => {
    router.push(ROUTES.SETTINGS);
  };

  const handleSupportClick = () => {
    router.push(ROUTES.SUPPORT);
  };

  const handleLogoutClick = async () => {
    try {
      await signOut({ redirectTo: ROUTES.HOME });
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <UserMenu />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="right"
        alignOffset={-10}
        sideOffset={2}
      >
        <DropdownMenuItem onClick={handleSettingClick}>
          설정 열기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSupportClick}>
          고객 관리
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive" onClick={handleLogoutClick}>
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenuDropdown;
