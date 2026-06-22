import { ClientSession } from "mongoose";
import { InterestDTO } from "../dtos/interestDto";
import { toInterestDTO, toInterestDTOs } from "../mappers/toInterestDTO";
import { interestRepository } from "../repositories/InterestRepository.instance";
import { categoryService } from "./CategoryService.instance";

export class InterestService {
  /**
   * 관심사 생성 서비스
   * 유효성 검사를 거친 후 리포지토리를 호출합니다.
   */
  async createInterest(data: {
    slug: string;
    name: string;
    categoryId: string;
  }): Promise<InterestDTO> {
    // categoryService 사용
    const category = await categoryService.getCategoryById(data.categoryId);
    if (!category) {
      throw new Error(`카테고리 ID ${data.categoryId}를 찾을 수 없습니다.`);
    }

    const compositeSlug = `${category.slug}/${data.slug}`;
    const exists = await interestRepository.findBySlug(compositeSlug);
    if (exists) {
      throw new Error(`이미 존재하는 관심사입니다: ${compositeSlug}`);
    }

    const doc = await interestRepository.create({
      ...data,
      slug: compositeSlug,
    });
    return toInterestDTO(doc);
  }

  /**
   * 관심사 목록 조회 (카테고리 필터링)
   */
  async getInterestsByCategoryId(categoryId: string): Promise<InterestDTO[]> {
    const docs = await interestRepository.findByCategoryId(categoryId);

    return toInterestDTOs(docs);
  }

  /**
   * 관심사 수정
   */
  async updateInterest(
    id: string,
    data: { slug?: string; name?: string; categoryId?: string },
  ): Promise<InterestDTO> {
    // categoryService 사용
    if (data.categoryId) {
      const category = await categoryService.getCategoryById(data.categoryId);
      if (!category) {
        throw new Error(`카테고리 ID ${data.categoryId}를 찾을 수 없습니다.`);
      }
    }

    const updated = await interestRepository.update(id, data);
    if (!updated) throw new Error("관심사를 찾을 수 없습니다.");
    return toInterestDTO(updated);
  }

  /**
   * 관심사 사용자 수 증가 (배치)
   */
  async incrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    await interestRepository.incrementUserCount(ids, session);
  }

  /**
   * 관심사 사용자 수 감소 (배치)
   */
  async decrementUserCount(
    ids: string[],
    session?: ClientSession,
  ): Promise<void> {
    await interestRepository.decrementUserCount(ids, session);
  }

  /**
   * 관심사 목록 조회 (카테고리 필터링 및 키워드 검색 지원)
   * filter: categoryId 또는 keyword를 포함하는 객체
   */
  async getInterests(filter: {
    categoryId?: string;
    keyword?: string;
  }): Promise<InterestDTO[]> {
    // 리포지토리의 조건부 조회 메서드 호출
    const docs = await interestRepository.findFiltered(filter);

    // DTO 변환 (기존 매핑 로직 유지)
    return toInterestDTOs(docs);
  }

  /**
   * 관심사 한 개 삭제
   */
  async deleteInterest(id: string, session?: ClientSession): Promise<boolean> {
    const deleted = await interestRepository.delete(id, session);
    if (!deleted) {
      throw new Error("관심사를 찾을 수 없거나 삭제에 실패했습니다.");
    }
    return deleted;
  }

  /**
   * 관심사 일괄 삭제 (카테고리 ID 기준)
   */
  async deleteInterestsByCategoryId(
    categoryId: string,
    session?: ClientSession,
  ): Promise<number> {
    const deletedCount = await interestRepository.deleteManyByCategoryId(
      categoryId,
      session,
    );
    return deletedCount;
  }
}
