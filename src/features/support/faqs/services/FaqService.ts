import {
  CreateFaqDto,
  FaqResponseDTO,
  FaqWithUserDtoPagedResponse,
  UpdateFaqDto,
} from "../dtos";
import { toFaqDto, toFaqDtos } from "../mappers/toFaqDto";
import { toFaqWithUserDtoS } from "../mappers/toFaqWithUserDto";
import { FaqRepository } from "../repository/FaqRepository";
import { faqRepository } from "../repository/FaqRepository.instance";
import { AdminFaqsQuery } from "../types/search";

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
   * FAQ 생성 (어드민 전용)
   * * @param dto 신규 FAQ 등록을 위한 데이터 규격
   * @returns 직렬화된 FAQ 응답 DTO
   */
  async createFaq(userId: string, dto: CreateFaqDto): Promise<FaqResponseDTO> {
    const faq = await this.faqRepository.create(userId, dto);
    return toFaqDto(faq);
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

  /**
   * FAQ 수정 (어드민 전용)
   * * @param id 수정할 FAQ의 고유 ID (문자열 형태의 ObjectId)
   * @param dto 변경할 FAQ 데이터 필드 집합
   * @returns 수정이 완료되어 원자적으로 갱신된 FAQ 응답 DTO
   * @throws {Error} 존재하지 않는 FAQ ID일 경우 예외 발생
   */
  async updateFaq(id: string, dto: UpdateFaqDto): Promise<FaqResponseDTO> {
    const updated = await this.faqRepository.update(id, dto);
    if (!updated) throw new Error("존재하지 않는 FAQ입니다.");
    return toFaqDto(updated);
  }

  /**
   * FAQ 삭제 (어드민 전용)
   * * @param id 삭제할 FAQ의 고유 ID (문자열 형태의 ObjectId)
   * @returns 삭제 성공 여부 (true: 성공, false: 실패)
   */
  async deleteFaq(id: string): Promise<boolean> {
    return this.faqRepository.deleteById(id);
  }

  getFaqById = async (id: string) => {
    const faq = await this.faqRepository.findById(id);
    if (!faq) throw new Error("FAQ를 찾을 수 없습니다.");
    return toFaqDto(faq);
  };

  async findAllPaginated(
    query: AdminFaqsQuery,
  ): Promise<FaqWithUserDtoPagedResponse> {
    const { items, totalCount } =
      await this.faqRepository.findAllPaginated(query);

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
