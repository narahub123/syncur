import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";

export const ErrorState = ({
  message = "정보를 불러오는 중 에러가 발생했습니다.",
}: {
  message?: string;
}) => (
  <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
    <p className="font-medium text-red-500">{message}</p>
    <Button asChild variant="outline">
      <Link href={ROUTES.SUPPORT_BUG_REPORTS}>버그 리포트 제출</Link>
    </Button>
  </div>
);

export const EmptyState = ({
  message = "데이터를 찾을 수 없습니다. 목록으로 이동합니다.",
}: {
  message?: string;
}) => (
  <div className="flex h-[50vh] flex-col items-center justify-center">
    <p className="text-muted-foreground">{message}</p>
  </div>
);
