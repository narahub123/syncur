import { Types } from "mongoose";
import { NoticeRepository } from "../repository/NoticeRepository";
import { NoticeResponseDTO } from "../dtos/noticeDto";
import { toNoticeDto, toNoticeDtos } from "../mappers/toNoticeDto";

import { PaginatedResponse } from "@/shared/types/pagination";
import { UserNoticesQuery } from "../types/search";

/**
 * Notice Service
 * * 공지사항(Notice) 도메인의 비즈니스 로직을 총괄하는 컨트롤 타워입니다.
 * Server Action으로부터 요청을 받아 데이터 유효성을 조율하고, DB 가공 데이터를 DTO 규격으로 변환하여 반환합니다.
 */
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  /**
   * 공지사항 상세 조회 및 조회수 증가 규칙 처리
   * * @description 단순히 데이터를 읽어오는 것을 넘어, "상세 보기 시 조회수를 원자적으로 1 증가시킨다"는
   * 비즈니스 도메인 규칙이 결합된 핵심 메서드입니다.
   * * @param id 조회할 공지사항의 고유 ID (문자열 형태)
   * @returns 조회수 갱신이 반영되어 직렬화된 공지사항 응답 DTO
   * @throws {Error} 일치하는 공지사항이 디비에 존재하지 않을 경우 예외 발생
   */
  async getNoticeDetail(id: string): Promise<NoticeResponseDTO> {
    const noticeId = new Types.ObjectId(id);
    const notice = await this.noticeRepository.findById(noticeId); // 그냥 조회만!
    if (!notice) throw new Error("존재하지 않는 공지사항입니다.");
    return toNoticeDto(notice);
  }

  async incrementNoticeViews(id: string): Promise<void> {
    const noticeId = new Types.ObjectId(id);
    await this.noticeRepository.incrementViews(noticeId);
  }

  /**
   * 공지사항 목록 전체 조회
   * * @param limit 최대로 가져올 공지사항 개수 (기본값: 10, 중요 공지 상단 고정 포함)
   * @returns 직렬화가 완료된 공지사항 응답 DTO 배열
   */
  async getAllNotices(limit = 10): Promise<NoticeResponseDTO[]> {
    const notices = await this.noticeRepository.findAll(limit);
    return toNoticeDtos(notices);
  }

  /**
   * 유저용 공지사항 목록 검색 및 페이지네이션 처리
   */
  async getNoticesForUser(
    query: UserNoticesQuery,
  ): Promise<PaginatedResponse<NoticeResponseDTO>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, totalCount } =
      await this.noticeRepository.findAndCountForUser({
        ...query,
        page,
        limit,
      });

    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    return {
      items: toNoticeDtos(items),
      pagination: { page, limit, totalCount, totalPages },
    };
  }
}
