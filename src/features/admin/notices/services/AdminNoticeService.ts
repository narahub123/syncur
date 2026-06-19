import { AdminNoticeResponseDTO } from "@/features/support/notices/dtos/noticeDto";
import {
  toAdminNoticeDto,
  toAdminNoticeDtos,
} from "@/features/support/notices/mappers/toAdminNoticeDto";
import { AdminNoticeRepository } from "../repositories/AdminNoticeRepository";
import { AdminNoticeQuery } from "../types/search";
import { PaginatedResponse } from "@/shared/types/pagination";

export class AdminNoticeService {
  constructor(private readonly noticeRepository: AdminNoticeRepository) {}
  /**
   * 관리자용 공지사항 목록 조회 비즈니스 처리 (PaginationMeta 포함)
   * * @param query 페이지네이션 및 필터 검색 매개변수
   * @returns 공통 PaginatedResponse 규격에 완전히 부합하는 어드민 DTO 패키지
   */
  async getNoticesForAdmin(
    query: AdminNoticeQuery,
  ): Promise<PaginatedResponse<AdminNoticeResponseDTO>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    // 레포지토리 어드민 룩업 파이프라인 호출
    const { items, totalCount } =
      await this.noticeRepository.findAllPaginatedForAdmin({
        ...query,
        page,
        limit,
      });

    // 전체 페이지 연산
    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    // 정형화된 공통 리턴 스펙 준수
    return {
      items: toAdminNoticeDtos(items),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }

  /**
   * 관리자용 상세 조회 (조회수 증가 X, 작성자 정보 포함)
   */
  async getAdminNoticeDetail(id: string): Promise<AdminNoticeResponseDTO> {
    const notice = await this.noticeRepository.findDetailForAdmin(id);

    if (!notice) {
      throw new Error("해당 공지사항을 찾을 수 없습니다.");
    }

    return toAdminNoticeDto(notice);
  }
}
