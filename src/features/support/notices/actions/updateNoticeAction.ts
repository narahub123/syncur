"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { UpdateNoticeRequestDto } from "../dtos";
import { noticeService } from "../services/NoticeService.instance";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { deleteCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";

export async function updateNoticeAction(
  id: string,
  dto: UpdateNoticeRequestDto,
) {
  await connectMongo();

  await requireAdmin();

  try {
    const { deletedImages, ...rest } = dto;

    // 1. 삭제해야 할 이미지가 있다면 삭제 실행
    if (deletedImages && deletedImages.length > 0) {
      await Promise.all(
        deletedImages.map((img) => deleteCloudinaryImage(img.publicId)),
      );
    }

    return await noticeService.updateNotice(id, rest);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "수정 실패",
    };
  }
}
