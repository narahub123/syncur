"use client";

import { NativeButtonProps } from "@/shared/types/element-props";
import { cn } from "@/shared/utils/cn";
import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

type SupportBackButtonProps = NativeButtonProps;

/**
 * 설정 하위 페이지 뒤로가기 버튼.
 *
 * 브라우저 히스토리를 기준으로 이전 페이지로 이동한다.
 */
const SupportBackButton = ({ className, ...props }: SupportBackButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  if (pathname === "/support") return null;

  return (
    <button
      {...props}
      type="button"
      aria-label="뒤로가기"
      title="뒤로가기"
      className={cn("hover:bg-accent w-full cursor-pointer p-3", className)}
      onClick={handleBack}
    >
      <ChevronLeft aria-hidden="true" />
    </button>
  );
};

export default SupportBackButton;
