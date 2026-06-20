"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToInquiryAction } from "../actions/replyToInquiryAction";
import { toast } from "sonner";
import { inquiryKeys } from "../constants/inquiryKeys";

export function useAdminInquiryReplyMutation(isEditMode: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replyToInquiryAction,

    onSuccess: (_, variables) => {
      // 리스트 전체 무효화
      queryClient.invalidateQueries({
        queryKey: inquiryKeys.all,
      });

      // 상세도 같이 무효화
      if (variables?.inquiryId) {
        queryClient.invalidateQueries({
          queryKey: inquiryKeys.detail(variables.inquiryId),
        });
      }

      toast.success(
        isEditMode ? "답변이 수정되었습니다." : "답변이 등록되었습니다.",
      );
    },

    onError: () => {
      toast.error("처리 중 오류가 발생했습니다.");
    },
  });
}
