"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requestService } from "@/features/support/requests/services/RequestService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/shared/constants/routes";

// 수정 시 사용할 DTO 정의 (필요시 별도 파일로 분리)
export interface UpdateRequestDto {
  requestId: string;
  title: string;
  content: string;
  metadata: {
    category: string;
    os?: string;
    browser?: string;
    images: { publicId: string; url: string }[];
  };
}

/**
 * 문의/버그 제보 수정 액션
 */
export async function updateRequestAction(dto: UpdateRequestDto) {
  try {
    await connectMongo();
    const session = await requireAuth();

    // 서비스 계층 호출
    const result = await requestService.updateRequest({
      requestId: dto.requestId,
      userId: session.user.id,
      title: dto.title,
      content: dto.content,
      metadata: dto.metadata,
    });

    revalidatePath(ROUTES.SUPPORT_REQUESTS);
    revalidatePath(`${ROUTES.SUPPORT_REQUESTS}/{dto.requestId}`);
    revalidatePath(`${ROUTES.SUPPORT_REQUESTS}/{dto.requestId}/edit`);

    return result;
  } catch (error) {
    console.error("문의/제보 수정 실패:", error);
    // 수정 실패 시에는 이미 업로드된 이미지를 롤백하기보다
    // 사용자가 다시 수정 시도하도록 유도하는 것이 안전할 수 있습니다.
    throw new Error("문의 요청 수정에 실패했습니다.");
  }
}
