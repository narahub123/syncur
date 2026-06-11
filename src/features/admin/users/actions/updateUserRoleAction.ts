"use server";

import { UserRole } from "@/features/users/constants/user-role";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { userService } from "../../../users/services/UserService.instance";

/**
 * Server Action
 * - auth / permission / service orchestration
 */
export async function updateUserRoleAction(userId: string, role: string) {
  /**
   * MongoDB 연결 보장
   */
  await connectMongo();

  /**
   * 관리자 권한 체크
   */
  await requireAdmin();

  const user = await userService.updateUserRole(userId, role as UserRole);

  return {
    success: true,
    user,
  };
}
