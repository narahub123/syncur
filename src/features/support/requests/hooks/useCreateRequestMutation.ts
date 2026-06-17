import { CreateRequestDto } from "@/features/support/requests/dtos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRequestAction } from "../actions/createRequestAction";
import { requestKeys } from "../constants/requestKeys";

/**
 * 문의/버그 제보 생성 처리 Mutation
 */
export function useCreateRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateRequestDto) => createRequestAction(dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: requestKeys.all,
      });
    },
  });
}
