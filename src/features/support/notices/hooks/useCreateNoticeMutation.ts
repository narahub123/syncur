import { CreateNoticeRequestDto } from "@/features/support/notices/dtos/noticeDto";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNoticeAction } from "../actions/createNoticeAction";

/**
 * 공지사항 생성 처리 Mutation
 */
export function useCreateNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateNoticeRequestDto) => createNoticeAction(dto),

    // 데이터가 성공적으로 생성되면 관련 공지사항 캐시 목록 갱신
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notices"],
      });

      // 만약 어드민 전용 키가 따로 있다면 함께 무효화
      queryClient.invalidateQueries({
        queryKey: ["admin-notices"],
      });
    },
  });
}
