"use server";

import { categoryService } from "@/features/interests/services/CategoryService.instance";

/**
 * 카테고리와 그에 속한 모든 관심사 목록을 함께 조회하는 서버 액션
 */
export async function getCategoriesWithInterestsAction() {
  try {
    // 1. 서비스에서 카테고리와 관심사 계층 구조 조회
    const categoriesWithInterests =
      await categoryService.getAllCategoriesWithInterests();

    return {
      success: true,
      data: categoriesWithInterests,
    };
  } catch (error) {
    console.error("카테고리 및 관심사 목록 조회 실패", error);
    return {
      success: false,
      error: "데이터를 불러오는데 실패했습니다.",
    };
  }
}
