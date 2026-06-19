import { FaqModel } from "../model/Faq";
import { FaqLean } from "../types/lean";

/**
 * Faq Repository
 * * MongoDB의 Faq(자주 묻는 질문) 컬렉션에 대한 직접적인 CRUD 연산을 담당하며,
 * 카테고리별 정렬 인덱싱 쿼리 및 원시 객체(Lean) 반환을 캡슐화합니다.
 */
export class FaqRepository {
  async getAllFaq(isPublishedOnly: boolean = false): Promise<FaqLean[]> {
    const query = isPublishedOnly ? { isPublished: true } : {};

    return await FaqModel.find(query).sort({ sortOrder: 1 }).lean();
  }

  /**
   * 카테고리별 FAQ 목록 조회 (sortOrder 오름차순, 최신순 정렬)
   * * @description 관리자가 지정한 노출 우선순위(sortOrder: 오름차순)를 기준으로 1차 정렬한 후,
   * 동일 순서 내에서는 최신 등록순(createdAt: 내림차순)으로 정렬하여 반환합니다.
   * * @param category 필터링할 특정 카테고리 명 (생략 시 전체 조회)
   * @returns 정렬 조건이 반영된 FAQ Lean 객체 배열
   */
  async findByCategory(category?: string): Promise<FaqLean[]> {
    const query = category ? { category } : {};
    return FaqModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean();
  }
}
