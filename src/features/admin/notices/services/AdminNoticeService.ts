import {
  AdminNoticeResponseDTO,
  CreateNoticeDto,
  NoticeResponseDTO,
  UpdateNoticeDto,
} from "@/features/support/notices/dtos/noticeDto";
import {
  toAdminNoticeDto,
  toAdminNoticeDtos,
} from "@/features/support/notices/mappers/toAdminNoticeDto";
import { AdminNoticeRepository } from "../repositories/AdminNoticeRepository";
import { AdminNoticeQuery } from "../types/search";
import { PaginatedResponse } from "@/shared/types/pagination";
import { toNoticeDto } from "@/features/support/notices/mappers/toNoticeDto";
import { toObjectId } from "@/shared/utils/toObjectId";
import { NoticeStatsDto } from "@/features/admin/notices/dto/noticeStatsDto";

export class AdminNoticeService {
  constructor(private readonly noticeRepository: AdminNoticeRepository) {}

  /**
   * 공지사항 생성 (어드민 전용)
   * * @param dto 생성할 공지사항 콘텐츠 데이터 (제목, 본문, 고정 여부 등)
   * @param adminId 작성을 요청한 관리자의 고유 ID (문자열 형태)
   * @returns 직렬화 과정을 거쳐 클라이언트에 안전하게 전달될 공지사항 응답 DTO
   */
  async createNotice(
    dto: CreateNoticeDto,
    adminId: string,
  ): Promise<NoticeResponseDTO> {
    const notice = await this.noticeRepository.create({
      ...dto,
      createdBy: toObjectId(adminId), // 💡 문자열 ID를 Mongoose 관계 설정을 위해 ObjectId로 변환하여 전달
    });
    return toNoticeDto(notice);
  }

  /**
   * 공지사항 수정 (어드민 전용)
   * * @param id 수정할 공지사항의 고유 ID (문자열 형태)
   * @param dto 변경하고자 하는 공지사항 필드 데이터 규격
   * @returns 원자적으로 수정이 완료된 후 직렬화된 공지사항 응답 DTO
   * @throws {Error} 수정 타겟 공지사항이 디비에 존재하지 않을 경우 예외 발생
   */
  async updateNotice(
    id: string,
    dto: UpdateNoticeDto,
  ): Promise<NoticeResponseDTO> {
    const updated = await this.noticeRepository.update(id, dto);
    if (!updated) throw new Error("존재하지 않는 공지사항입니다.");
    return toNoticeDto(updated);
  }

  /**
   * 공지사항 삭제 (어드민 전용)
   * * @param id 삭제할 공지사항의 고유 ID (문자열 형태)
   * @returns 삭제가 정상적으로 수행되었는지 여부 (true: 성공, false: 대상 없음)
   */
  async deleteNotice(id: string): Promise<boolean> {
    return this.noticeRepository.deleteById(id);
  }

  /**
   * 관리자용 공지사항 목록 조회 비즈니스 처리 (PaginationMeta 포함)
   * * @param query 페이지네이션 및 필터 검색 매개변수
   * @returns 공통 PaginatedResponse 규격에 완전히 부합하는 어드민 DTO 패키지
   */
  async getNoticesForAdmin(
    query: AdminNoticeQuery,
  ): Promise<
    PaginatedResponse<AdminNoticeResponseDTO> & { stats: NoticeStatsDto }
  > {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    // 레포지토리 어드민 룩업 파이프라인 호출
    const { items, totalCount, stats } =
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
      stats,
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
