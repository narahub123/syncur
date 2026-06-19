import { AdminFaqsQuery } from "@/features/admin/faqs/types/search";
import { FaqResponseDTO, FaqWithUserDtoPagedResponse } from "../dtos";
import { toFaqDtos } from "../mappers/toFaqDto";
import { toFaqWithUserDtoS } from "../mappers/toFaqWithUserDto";
import { FaqRepository } from "../repository/FaqRepository";
import { faqRepository } from "../repository/FaqRepository.instance";
import { adminFaqRepository } from "@/features/admin/faqs/repositories/AdminFaqRepository.instance";

/**
 * Faq Service
 * * FAQ(자주 묻는 질문) 도메인의 비즈니스 로직을 담당하며,
 * Server Action과 Repository 사이에서 데이터 가공 및 DTO 변환을 조율합니다.
 */
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  /**
   * FAQ 목록 조회
   * @param isPublishedOnly - true면 공개된 것만, false면 전체 조회
   */
  async getAllFaq(isPublishedOnly: boolean = false): Promise<FaqResponseDTO[]> {
    const faqs = await faqRepository.getAllFaq(isPublishedOnly);

    return toFaqDtos(faqs);
  }

  /**
   * 카테고리별 FAQ 목록 조회 및 DTO 직렬화
   * * @param category 필터링할 FAQ 카테고리 (선택 사항)
   * @returns 지정된 정렬 기준(sortOrder)이 반영된 FAQ 응답 DTO 배열
   */
  async getFaqsByCategory(category?: string): Promise<FaqResponseDTO[]> {
    const faqs = await this.faqRepository.findByCategory(category);
    return toFaqDtos(faqs);
  }

  async findAllPaginated(
    query: AdminFaqsQuery,
  ): Promise<FaqWithUserDtoPagedResponse> {
    const { items, totalCount } =
      await adminFaqRepository.findAllPaginated(query);

    return {
      items: toFaqWithUserDtoS(items), // 기존에 작성하시던 변환 함수
      pagination: {
        page: query.page,
        limit: query.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / query.limit),
      },
    };
  }
}
