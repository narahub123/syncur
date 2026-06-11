import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "../api/updateUserRole";
import { UserRole } from "@/features/users/constants/user-role";

/**
 * role 변경 mutation
 */
export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateUserRole(userId, role),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
}
