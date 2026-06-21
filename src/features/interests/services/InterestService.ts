import { ClientSession } from "mongoose";
import { InterestDTO } from "../dtos/interestDto";
import { toInterestDTO, toInterestDTOs } from "../mappers/toInterestDTO";
import { categoryRepository } from "../repositories/CategoryRepository.instance";
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
    // 1. 카테고리 존재 여부 및 상세 정보(slug) 조회
    const category = await categoryService.getCategoryById(data.categoryId);
    if (!category) {
      throw new Error(`카테고리 ID ${data.categoryId}를 찾을 수 없습니다.`);
    }

    // 2. 비즈니스 로직: 네임스페이스 전략 (categorySlug/interestSlug)
    const compositeSlug = `${category.slug}/${data.slug}`;

    // 3. 중복 검사: 해당 조합의 slug가 이미 존재하는지 리포지토리에서 확인
    const exists = await interestRepository.findBySlug(compositeSlug);
    if (exists) {
      throw new Error(`이미 존재하는 관심사입니다: ${compositeSlug}`);
    }

    // 4. 조합된 slug로 데이터 생성
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
    // 카테고리 ID가 변경되는 경우에만 존재 여부 체크
    if (data.categoryId) {
      const category = await categoryRepository.findById(data.categoryId);
      if (!category) {
        throw new Error(`카테고리 ID ${data.categoryId}를 찾을 수 없습니다.`);
      }
    }

    const updated = await interestRepository.update(id, data);
    if (!updated) {
      throw new Error("관심사를 찾을 수 없거나 수정에 실패했습니다.");
    }
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
}
