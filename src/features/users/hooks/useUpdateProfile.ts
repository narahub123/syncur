import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserProfileAction } from "../actions/updateProfileAction";
import { useSession } from "next-auth/react";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { update } = useSession();

  return useMutation({
    mutationFn: updateUserProfileAction,
    onSuccess: async () => {
      await update();
      toast.success("프로필이 성공적으로 수정되었습니다."); // 💡 성공 토스트
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
    onError: (error) => {
      toast.error("프로필 수정에 실패했습니다. 잠시 후 다시 시도해주세요."); // 💡 에러 토스트
      console.error("Mutation Error:", error);
    },
  });
}
