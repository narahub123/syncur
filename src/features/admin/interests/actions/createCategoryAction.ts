"use server";

import { categoryService } from "@/features/interests/services/CategoryService.instance";
import { categorySchema } from "../schemas/category";
import { isDatabaseError } from "@/shared/error/isDatabaseError";

export async function createCategoryAction(data: {
  slug: string;
  name: string;
}) {
  const validated = categorySchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "유효성 검사 실패" };
  }

  try {
    const category = await categoryService.createCategory(validated.data);
    return { success: true, data: category };
  } catch (error: unknown) {
    // 3. 타입 가드를 사용하여 any 없이 안전하게 접근
    if (isDatabaseError(error) && error.code === 11000) {
      return {
        success: false,
        error: "이미 사용 중인 Slug입니다. 다른 값을 입력해 주세요.",
      };
    }

    return {
      success: false,
      error: "카테고리 생성 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}
