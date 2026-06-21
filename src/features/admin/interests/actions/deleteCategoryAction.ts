"use server";

import { categoryService } from "@/features/interests/services/CategoryService.instance";
import { isDatabaseError } from "@/shared/error/isDatabaseError";
import { revalidatePath } from "next/cache";

export async function deleteCategoryAction(categoryId: string) {
  try {
    // CategoryService 내에서 트랜잭션으로 관심사 일괄 삭제 후 카테고리 삭제 수행
    const success = await categoryService.deleteCategory(categoryId);

    if (success) {
      revalidatePath("/admin/categories"); // 필요 경로 재검증
      return { success: true };
    }

    return { success: false, error: "카테고리를 찾을 수 없습니다." };
  } catch (error: unknown) {
    // 데이터베이스 관련 에러 처리 패턴 유지
    if (isDatabaseError(error)) {
      return {
        success: false,
        error: "삭제 작업 중 데이터베이스 오류가 발생했습니다.",
      };
    }

    return {
      success: false,
      error: "카테고리 삭제 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}
