import { AdminFaqRepository } from "../repositories/AdminFaqRepository";
import { AdminFaqsQuery } from "../types/search";
import {
  CreateFaqDto,
  FaqResponseDTO,
  FaqWithUserDtoPagedResponse,
  UpdateFaqDto,
} from "@/features/support/faqs/dtos";
import { toFaqWithUserDtoS } from "@/features/support/faqs/mappers/toFaqWithUserDto";
import { FaqStatsDto } from "../types/stats";
import { toFaqDto } from "@/features/support/faqs/mappers/toFaqDto";

export class AdminFaqService {
  constructor(private readonly adminFaqRepository: AdminFaqRepository) {}

  /**
   * FAQ 생성 (어드민 전용)
   * * @param dto 신규 FAQ 등록을 위한 데이터 규격
   * @returns 직렬화된 FAQ 응답 DTO
   */
  async createFaq(userId: string, dto: CreateFaqDto): Promise<FaqResponseDTO> {
    const faq = await this.adminFaqRepository.create(userId, dto);
    return toFaqDto(faq);
  }

  /**
   * FAQ 수정 (어드민 전용)
   * * @param id 수정할 FAQ의 고유 ID (문자열 형태의 ObjectId)
   * @param dto 변경할 FAQ 데이터 필드 집합
   * @returns 수정이 완료되어 원자적으로 갱신된 FAQ 응답 DTO
   * @throws {Error} 존재하지 않는 FAQ ID일 경우 예외 발생
   */
  async updateFaq(id: string, dto: UpdateFaqDto): Promise<FaqResponseDTO> {
    const updated = await this.adminFaqRepository.update(id, dto);
    if (!updated) throw new Error("존재하지 않는 FAQ입니다.");
    return toFaqDto(updated);
  }

  /**
   * FAQ 삭제 (어드민 전용)
   * * @param id 삭제할 FAQ의 고유 ID (문자열 형태의 ObjectId)
   * @returns 삭제 성공 여부 (true: 성공, false: 실패)
   */
  async deleteFaq(id: string): Promise<boolean> {
    return this.adminFaqRepository.deleteById(id);
  }

  getFaqById = async (id: string) => {
    const faq = await this.adminFaqRepository.findById(id);
    if (!faq) throw new Error("FAQ를 찾을 수 없습니다.");
    return toFaqDto(faq);
  };

  /**
   * FAQ 목록 조회
   */
  async findAllPaginated(
    query: AdminFaqsQuery,
  ): Promise<FaqWithUserDtoPagedResponse & { stats: FaqStatsDto }> {
    const { items, totalCount, stats } =
      await this.adminFaqRepository.findAllPaginated(query);

    return {
      items: toFaqWithUserDtoS(items),
      stats,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / query.limit),
      },
    };
  }
}
