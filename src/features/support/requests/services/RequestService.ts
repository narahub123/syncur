import { Types } from "mongoose";
import { RequestRepository } from "../repository/RequestRepository";
import { CreateRequestDto, RequestResponseDTO } from "../dtos";
import { REQUEST_STATUS } from "../constants/request-type";
import { toRequestDto, toRequestDtos } from "../mappers/toRequestDto";
import {
  AdminRequestQuery,
  AdminRequestResponseDTO,
} from "../types/admin-search";
import { PaginatedResponse } from "@/shared/types/pagination";
import { toAdminRequestDtos } from "../mappers/toAdminRequestDtos";
import { UserRequestQuery } from "../../notices/types/user-search";

export class RequestService {
  constructor(private readonly requestRepository: RequestRepository) {}

  /**
   * 유저의 신규 문의 접수 (기본 PENDING 상태 및 다중 파일 수용)
   */
  async createRequest(
    dto: CreateRequestDto,
    userId: string,
    userEmail: string,
  ): Promise<RequestResponseDTO> {
    const request = await this.requestRepository.create({
      ...dto,
      userId,
      userEmail,
      status: REQUEST_STATUS.PENDING,
      metadata: dto.metadata
        ? {
            ...dto.metadata,
            images: dto.metadata.images ?? [], // 💡 다중 이미지 배열 보장
          }
        : undefined,
    });
    return toRequestDto(request);
  }

  /**
   * 유저 본인 문의 목록 조회
   */
  async getMyRequests(userId: string): Promise<RequestResponseDTO[]> {
    const requests = await this.requestRepository.findByUserId(userId);
    return toRequestDtos(requests);
  }

  /**
   * 관리자 답변 등록 프로세서 (비즈니스 상태 다변화 가능)
   */
  async replyToRequest(params: {
    requestId: string;
    replyContent: string;
    adminId: string;
    isBugResolved?: boolean;
  }): Promise<RequestResponseDTO> {
    // 버그 리포트의 경우 해결 여부에 따라 상태 매핑 분기 처리
    const targetStatus = params.isBugResolved
      ? REQUEST_STATUS.RESOLVED
      : REQUEST_STATUS.COMPLETED;

    const updated = await this.requestRepository.submitAdminReply({
      requestId: params.requestId,
      replyContent: params.replyContent,
      repliedBy: params.adminId,
      status: targetStatus,
    });

    if (!updated) throw new Error("존재하지 않는 문의 요청입니다.");

    // 💡 TO-DO: 향후 유저 알림용 sendBulkSseNotifications 처리 연동 자리

    return toRequestDto(updated);
  }

  /**
   * 관리자 답변 수정 프로세서
   */
  async modifyAdminReply(
    requestId: string,
    replyContent: string,
  ): Promise<RequestResponseDTO> {
    const updated = await this.requestRepository.updateAdminReply({
      requestId: new Types.ObjectId(requestId),
      replyContent,
    });

    if (!updated) throw new Error("답변을 수정할 문의 내역을 찾지 못했습니다.");
    return toRequestDto(updated);
  }

  /**
   * 관리자용 제보 목록 조회 처리 (비즈니스 파이프라인 조율)
   * * @param query 페이지네이션 및 필터 매개변수
   * @returns 공통 PaginatedResponse 규격에 맞춰 정제된 관리자용 DTO 세트
   */
  async getRequestsForAdmin(
    query: AdminRequestQuery,
  ): Promise<PaginatedResponse<AdminRequestResponseDTO>> {
    // 프로젝트 전역 상수 컨벤션 적용 (PAGINATION 기본값 매핑)
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    // 레포지토리 원시 파이프라인 호출
    const { items, totalCount } =
      await this.requestRepository.findAllPaginatedForAdmin({
        ...query,
        page,
        limit,
      });

    // 전체 페이지 수 동적 연산
    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    // 공통 Pagination 컨벤션 규격 엄격 준수 리턴
    return {
      items: toAdminRequestDtos(items),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }

  /**
   * 유저 본인의 1:1 문의 내역 검색 및 페이지네이션 처리
   */
  async getMyRequestsPaginated(
    userId: string,
    query: UserRequestQuery,
  ): Promise<PaginatedResponse<RequestResponseDTO>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, totalCount } =
      await this.requestRepository.findAndCountForUser(userId, {
        ...query,
        page,
        limit,
      });

    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    return {
      items: toRequestDtos(items),
      pagination: { page, limit, totalCount, totalPages },
    };
  }
  /**
   * 문의 내역 상세 조회
   * * @param requestId 문의 고유 ID
   * @returns 조회된 문의 내역 DTO
   */
  async getRequestById(requestId: string): Promise<RequestResponseDTO> {
    const request = await this.requestRepository.findById(requestId);

    if (!request) {
      throw new Error("존재하지 않는 문의 내역입니다.");
    }

    return toRequestDto(request);
  }
}
