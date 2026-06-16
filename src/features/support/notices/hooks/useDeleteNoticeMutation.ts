import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteNoticeAction } from "../actions/deleteNoticeAction";
import { ROUTES } from "@/shared/constants/routes";

export function useDeleteNoticeMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => deleteNoticeAction(id),
    onSuccess: () => {
      // 1. FAQ 목록 캐시를 무효화하여 최신 데이터로 업데이트
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      toast.success("공지가 성공적으로 삭제되었습니다.");
      // 2. 삭제 완료 후 목록 페이지로 이동
      router.push(ROUTES.ADMIN_NOTICES);
    },
    onError: (error) => {
      console.error(error);
      toast.error("공지 삭제 중 오류가 발생했습니다.");
    },
  });
}
