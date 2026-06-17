"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToRequestAction } from "../actions/replyToRequestAction";
import { toast } from "sonner";
import { requestKeys } from "../constants/requestKeys";

export function useAdminReplyMutation(isEditMode: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replyToRequestAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestKeys.all });

      // 2. 토스트 알림 표시
      toast.success(
        isEditMode ? "답변이 수정되었습니다." : "답변이 등록되었습니다.",
      );
    },
    onError: () => {
      toast.error("처리 중 오류가 발생했습니다.");
    },
  });
}
