import { CreateRequestDto } from "@/features/support/requests/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRequestAction } from "../actions/createRequestAction";

/**
 * 문의/버그 제보 생성 처리 Mutation
 */
export function useCreateRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRequestDto) => createRequestAction(dto),

    onSuccess: () => {
      // 유저의 마이페이지 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["my-requests"],
      });

      // 관리자용 목록 캐시 무효화 (있는 경우)
      queryClient.invalidateQueries({
        queryKey: ["admin-requests"],
      });
    },
  });
}
