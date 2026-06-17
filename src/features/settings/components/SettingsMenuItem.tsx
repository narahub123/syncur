import Link from "next/link";
import type { SettingsMenuItemType } from "../types/settings";
import { ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type SettingsMenuItemProps = SettingsMenuItemType;

/**
 * 설정 메뉴 항목.
 *
 * 설정 상세 페이지로 이동하는 링크를 표시한다.
 * 접근성을 위해 링크 전체를 클릭 가능 영역으로 제공한다.
 */
const SettingsMenuItem = ({ href, label }: SettingsMenuItemProps) => {
  return (
    <Button
      key={label}
      variant="ghost"
      className="hover:bg-accent/50 flex w-full items-center justify-between rounded-none px-6 py-8 text-base font-medium" // padding을 늘려 여유롭게
      asChild
    >
      <Link href={href}>
        {label}
        <ChevronRight
          className="text-muted-foreground/50 size-5"
          aria-hidden="true"
        />
      </Link>
    </Button>
  );
};

export default SettingsMenuItem;
