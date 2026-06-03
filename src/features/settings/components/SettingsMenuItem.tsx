import Link from "next/link";
import type { SettingsMenuItemType } from "../types/settings";
import { ChevronRight } from "lucide-react";

type SettingsMenuItemProps = SettingsMenuItemType;

/**
 * 설정 메뉴 항목.
 *
 * 설정 상세 페이지로 이동하는 링크를 표시한다.
 * 접근성을 위해 링크 전체를 클릭 가능 영역으로 제공한다.
 */
const SettingsMenuItem = ({ href, label }: SettingsMenuItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border-b border-gray-100 px-3 py-6 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-blue-500"
    >
      <span>{label}</span>
      <ChevronRight aria-hidden="true" />
    </Link>
  );
};

export default SettingsMenuItem;
