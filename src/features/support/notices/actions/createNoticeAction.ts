"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { noticeService } from "@/features/support/notices/services/NoticeService.instance";
import { CreateNoticeRequestDto } from "@/features/support/notices/dtos/noticeDto";
import { deleteCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";

export async function createNoticeAction(data: CreateNoticeRequestDto) {
  try {
    await connectMongo();

    const session = await requireAdmin();

    const { deletedImages, ...rest } = data;

    // 1. 삭제해야 할 이미지가 있다면 삭제 실행
    if (deletedImages && deletedImages.length > 0) {
      await Promise.all(
        deletedImages.map((img) => deleteCloudinaryImage(img.publicId)),
      );
    }

    // 2. 게시글 생성
    return await noticeService.createNotice(rest, session.user.id);
  } catch (error) {
    console.error("Notice 생성 실패:", error);

    if (data.images && data.images.length > 0) {
      try {
        await Promise.all(
          data.images.map((img) => deleteCloudinaryImage(img.publicId)),
        );
        console.log("실패한 Notice의 이미지 삭제 완료");
      } catch (deleteError) {
        console.error("이미지 정리 실패:", deleteError);
      }
    }

    throw new Error("게시글 작성에 실패했습니다.");
  }
}
