import { ClientSession } from "mongoose";
import { InterestDTO } from "../dtos/interestDto";
import { toInterestDTO, toInterestDTOs } from "../mappers/toInterestDTO";
import { categoryRepository } from "../repositories/CategoryRepository.instance";
import { interestRepository } from "../repositories/InterestRepository.instance";

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
    // 1. 카테고리 존재 여부 검증
    const category = await categoryRepository.findById(data.categoryId);
    if (!category) {
      throw new Error(`카테고리 ID ${data.categoryId}를 찾을 수 없습니다.`);
    }

    // 2. 비즈니스 로직 수행 (필요 시 슬러그 중복 체크 등 추가 가능)

    // 3. 리포지토리 호출
    const doc = await interestRepository.create(data);

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
}
