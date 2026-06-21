import { ClientSession } from "mongoose";
import { CategoryDTO } from "../dtos/categoryDto";
import { toCategoryDTO, toCategoryDTOs } from "../mappers/toCategoryDTO";
import { categoryRepository } from "../repositories/CategoryRepository.instance";

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
  async deleteCategory(id: string): Promise<boolean> {
    // 삭제 전, 해당 카테고리를 참조하는 Interest가 있는지 확인하는 로직을
    // 여기서 수행하면 데이터 정합성을 더 완벽하게 지킬 수 있습니다.
    return await categoryRepository.delete(id);
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
}
