"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  message?: string;
  href?: string;
}

export const AdminBackButton = ({
  message = "목록으로",
  href,
}: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center pl-0 hover:bg-transparent"
      onClick={handleClick}
      aria-label="이전 페이지로 돌아가기"
    >
      <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
      {message}
    </Button>
  );
};
