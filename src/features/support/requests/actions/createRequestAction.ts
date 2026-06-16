"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requestService } from "@/features/support/requests/services/RequestService.instance";
import { CreateRequestDto } from "@/features/support/requests/dtos";
import { deleteCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

/**
 * 문의/버그 제보 생성 액션
 * @description 에러 발생 시 이미 업로드된 이미지를 정리하는 롤백 로직 포함
 */
export async function createRequestAction(data: CreateRequestDto) {
  try {
    await connectMongo();

    const session = await requireAuth();

    const { id: userId, email: userEmail } = session.user;

    // 2. 문의 요청 생성
    return await requestService.createRequest(
      data,
      userId,
      data.email ?? userEmail,
    );
  } catch (error) {
    console.error("문의/제보 생성 실패:", error);

    // 3. 에러 발생 시 metadata에 포함된 이미지들 롤백(삭제)
    if (data.metadata?.images && data.metadata.images.length > 0) {
      try {
        await Promise.all(
          data.metadata.images.map((img) =>
            deleteCloudinaryImage(img.publicId),
          ),
        );
        console.log("실패한 Request의 이미지 정리 완료");
      } catch (deleteError) {
        console.error("이미지 정리 실패:", deleteError);
      }
    }

    throw new Error("문의 요청 작성에 실패했습니다.");
  }
}
