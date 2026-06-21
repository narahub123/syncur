"use server";

import { categoryService } from "@/features/interests/services/CategoryService.instance";

export async function getCategoriesAction() {
  try {
    // Service에서 전체 목록을 조회하는 메서드를 호출 (예: getAllCategories)
    const categories = await categoryService.getAllCategories();
    return { success: true, data: categories };
  } catch (error) {
    console.error("카테고리 목록 조회 실패", error);
    return {
      success: false,
      error: "카테고리 목록을 불러오는데 실패했습니다.",
    };
  }
}
