"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { UpdateNoticeRequestDto } from "../../../support/notices/dtos/noticeDto";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";
import { deleteCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";
import { adminNoticeService } from "../services/AdminNoticeService.instance";

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

    return await adminNoticeService.updateNotice(id, rest);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "수정 실패",
    };
  }
}
