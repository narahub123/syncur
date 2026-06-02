"use client";

import { Dropdown } from "@/shared/components/ui/Dropdown";
import UserMenu from "./UserMenu";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/shared/constants/routes";
import { useRouter } from "next/navigation";

const UserMenuDropdown = () => {
  const router = useRouter();

  const handleSettingClick = () => {
    router.push(ROUTES.SETTINGS);
  };
  const handleLogoutClick = async () => {
    try {
      await signOut({ redirectTo: ROUTES.HOME });
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  const userMenu = [
    { name: "로그아웃", onClick: handleLogoutClick },
    { name: "설정 열기", onClick: handleSettingClick },
  ];
  return (
    <Dropdown.Root placement="right-start">
      <Dropdown.Trigger>
        <UserMenu />
      </Dropdown.Trigger>
      <Dropdown.Content>
        {userMenu.map((item) => (
          <Dropdown.Item key={item.name} onClick={item.onClick}>
            {item.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
};

export default UserMenuDropdown;
