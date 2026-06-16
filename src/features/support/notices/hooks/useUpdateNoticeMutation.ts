import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateNoticeRequestDto } from "../dtos";
import { updateNoticeAction } from "../actions/updateNoticeAction";

export function useUpdateNoticeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateNoticeRequestDto }) =>
      updateNoticeAction(id, dto),
    onSuccess: (_, variables) => {
      // 상세 페이지 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: ["admin-notice", variables.id],
      });
      // 목록 페이지 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
    },
  });
}
