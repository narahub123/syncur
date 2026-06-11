import { UserRole } from "@/features/users/constants/user-role";
import { updateUserRoleAction } from "../actions/updateUserRoleAction";

/**
 * client → server action bridge
 */
export async function updateUserRole(userId: string, role: UserRole) {
  return updateUserRoleAction(userId, role);
}
