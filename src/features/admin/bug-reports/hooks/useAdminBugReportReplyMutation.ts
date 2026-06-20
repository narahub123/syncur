"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replyToBugReportAction } from "../actions/replyToBugReportAction";
import { toast } from "sonner";
import { bugReportKeys } from "../constants/bugReportKeys";

export function useAdminBugReportReplyMutation(isEditMode: boolean) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replyToBugReportAction,

    onSuccess: (_, variables) => {
      // 리스트 전체 무효화
      queryClient.invalidateQueries({
        queryKey: bugReportKeys.all,
      });

      // 상세도 같이 무효화
      if (variables?.bugReportId) {
        queryClient.invalidateQueries({
          queryKey: bugReportKeys.detail(variables.bugReportId),
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
