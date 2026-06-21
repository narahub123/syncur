import { ClientSession } from "mongoose";
import { CategoryDTO } from "../dtos/categoryDto";
import { toCategoryDTO, toCategoryDTOs } from "../mappers/toCategoryDTO";
import { categoryRepository } from "../repositories/CategoryRepository.instance";
import { toInterestDTOs } from "../mappers/toInterestDTO";
import mongoose from "mongoose";
import { interestService } from "./InterestService.instance";

export class CategoryService {
  /**
   * 카테고리 생성 서비스
   */
  async createCategory(data: {
    slug: string;
    name: string;
  }): Promise<CategoryDTO> {
    // 1. 비즈니스 로직: 슬러그 중복 검사 등 필요 시 추가
    // (예: const existing = await categoryRepository.findBySlug(data.slug); if(existing) throw ...)

    // 2. 리포지토리 호출
    const doc = await categoryRepository.create(data);

    return toCategoryDTO(doc);
  }

  /**
   * 모든 카테고리 조회
   */
  async getAllCategories(): Promise<CategoryDTO[]> {
    const docs = await categoryRepository.findAll();
    return toCategoryDTOs(docs);
  }

  /**
   * ID로 단일 카테고리 조회
   */
  async getCategoryById(id: string): Promise<CategoryDTO | null> {
    const doc = await categoryRepository.findById(id);
    if (!doc) return null;
    return toCategoryDTO(doc);
  }

  /**
   * 카테고리 수정
   */
  async updateCategory(
    id: string,
    data: { slug?: string; name?: string },
  ): Promise<CategoryDTO> {
    const updated = await categoryRepository.update(id, data);

    if (!updated) {
      throw new Error("카테고리를 찾을 수 없거나 수정에 실패했습니다.");
    }

    return toCategoryDTO(updated);
  }

  /**
   * 카테고리 삭제
   */
  /**
   * 카테고리 삭제 (관심사 일괄 삭제 포함)
   */
  async deleteCategory(id: string): Promise<boolean> {
    const session = await mongoose.startSession(); // 올바른 문법
    session.startTransaction();

    try {
      // 1. 관심사 삭제 시 세션 전달
      await interestService.deleteInterestsByCategoryId(id, session);

      // 2. 카테고리 삭제 시 세션 전달
      await categoryRepository.delete(id, session);

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async incrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    await categoryRepository.incrementUserCount(ids, session);
  }

  async decrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    await categoryRepository.decrementUserCount(ids, session);
  }

  /**
   * 카테고리와 그 안의 모든 관심사를 계층 구조로 조회
   */
  async getAllCategoriesWithInterests() {
    // 1. 레포지토리에서 조인된 데이터 조회
    const categoriesWithInterests =
      await categoryRepository.findAllWithInterests();

    // 2. DTO 변환 (관심사도 함께 변환)
    return categoriesWithInterests.map((item) => ({
      ...toCategoryDTO(item),
      interests: toInterestDTOs(item.interests),
    }));
  }
}
