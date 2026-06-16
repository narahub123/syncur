"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { noticeService } from "@/features/support/notices/services/NoticeService.instance";
import { CreateNoticeDto } from "@/features/support/notices/dtos";
import { deleteCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";
import { requireAdmin } from "@/features/admin/lib/requireAdmin";

export async function createNoticeAction(data: CreateNoticeDto) {
  try {
    await connectMongo();

    const session = await requireAdmin();

    return await noticeService.createNotice(data, session.user.id);
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
