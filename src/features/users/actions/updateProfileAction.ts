"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { revalidatePath } from "next/cache";
import { userService } from "../services/UserService.instance";
import { ROUTES } from "@/shared/constants/routes";

export async function updateUserProfileAction(data: {
  name: string;
  profileImage: ImageInfo | null;
}) {
  await connectMongo();

  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("인증되지 않은 사용자입니다.");
  }

  try {
    // 1. 서비스 로직을 통해 업데이트 및 이전 이미지 정리 수행
    const updatedUser = await userService.updateProfile(session.user.id, data);

    // 2. 필요 시 캐시 무효화 (프로필 페이지 등)
    revalidatePath(ROUTES.SETTINGS_ACCOUNT);

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    throw new Error("프로필 업데이트에 실패했습니다.");
  }
}
