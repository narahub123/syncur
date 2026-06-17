import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateRequestAction,
  UpdateRequestDto,
} from "../actions/updateRequestAction";
import { requestKeys } from "../constants/requestKeys";

/**
 * 문의/버그 제보 수정 처리 Mutation
 */
export function useUpdateRequestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateRequestDto) => updateRequestAction(dto),

    onSuccess: async () => {
      console.log("success");

      await queryClient.invalidateQueries({
        queryKey: requestKeys.all,
      });

      console.log("invalidated");
    },
  });
}
