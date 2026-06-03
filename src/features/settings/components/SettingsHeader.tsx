"use client";

import { usePathname } from "next/navigation";
import SettingsBackButton from "./SettingsBackButton";
import { ROUTES } from "@/shared/constants/routes";

/**
 * 설정 공통 헤더.
 *
 * 설정 메인 페이지에서는 표시하지 않고,
 * 설정 하위 페이지에서만 뒤로가기 버튼을 노출한다.
 */
const SettingsHeader = () => {
  const pathname = usePathname();

  if (pathname === ROUTES.SETTINGS) return null;

  return (
    <header className="flex border-b border-gray-100">
      <SettingsBackButton />
    </header>
  );
};

export default SettingsHeader;
