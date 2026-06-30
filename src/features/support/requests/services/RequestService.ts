import { Types } from "mongoose";
import { RequestRepository } from "../repository/RequestRepository";
import { CreateRequestDto, RequestResponseDTO } from "../dtos";
import {
  REQUEST_STATUS,
  REQUEST_TYPE,
  RequestStatus,
} from "../constants/request-type";
import { toRequestDto, toRequestDtos } from "../mappers/toRequestDto";
import {
  AdminRequestQuery,
  AdminRequestResponseDTO,
} from "../types/admin-search";
import { PaginatedResponse } from "@/shared/types/pagination";
import {
  toAdminRequestDto,
  toAdminRequestDtos,
} from "../mappers/toAdminRequestDtos";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { UserRequestQuery } from "../types/search";
import { BugReportStatsService } from "../../bug-reports/service/BugReportStatsService";
import { BUG_REPORT_STATUS } from "@/features/admin/bug-reports/types/search";
import { InquiryStatsService } from "../../inquiries/service/InquiryStatsService";
import { INQUIRY_STATUS } from "@/features/admin/inquiries/types/search";
import { notificationService } from "@/features/notifications/service/NotificationService.instance";

export class RequestService {
  private readonly bugReportStatsService = new BugReportStatsService();
  private readonly inquiryStatsService = new InquiryStatsService();
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

    // 1. 버그 리포트인 경우 기존 통계 트리거
    if (request.type === REQUEST_TYPE.BUG_REPORT) {
      await notificationService.createAdminReportNotification({
        reportId: request._id.toString(),
        userId: userId.toString(),
        reason: dto.title,
      });
      await this.bugReportStatsService.handleBugReportCreated(
        BUG_REPORT_STATUS.PENDING,
      );
    }

    // 🎯 2. 일반 문의(INQUIRY)인 경우 신규 통계 트리거
    if (request.type === REQUEST_TYPE.INQUIRY) {
      await notificationService.createAdminInquiryNotification({
        inquiryId: request._id.toString(),
        userId: userId.toString(),
        title: dto.title,
        message: dto.title,
      });

      await this.inquiryStatsService.handleInquiryCreated(
        INQUIRY_STATUS.PENDING,
      );
    }

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
    images: ImageInfo[];
    adminId: string;
    status: RequestStatus;
  }): Promise<RequestResponseDTO> {
    // 버그 리포트의 경우 해결 여부에 따라 상태 매핑 분기 처리

    const updated = await this.requestRepository.submitAdminReply({
      requestId: params.requestId,
      replyContent: params.replyContent,
      images: params.images,
      repliedBy: params.adminId,
      status: params.status,
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

  /**
   * 관리자 전용 문의 상세 조회 (작성자 및 답변자 정보 포함)
   */
  async getRequestByIdForAdmin(
    requestId: string,
  ): Promise<AdminRequestResponseDTO> {
    const request = await this.requestRepository.findByIdForAdmin(requestId);

    if (!request) {
      throw new Error("존재하지 않는 문의 내역입니다.");
    }

    // toAdminRequestDtos가 배열을 처리하므로, 단일 객체 매퍼를 사용하거나
    // 배열 형태로 감싸서 처리 후 첫 번째 요소를 반환
    return toAdminRequestDto(request);
  }

  /**
   * 사용자 요청 수정 비즈니스 로직
   */
  async updateRequest(params: {
    requestId: string;
    userId: string; // 수정 요청한 사용자 ID
    title: string;
    content: string;
    metadata: {
      category: string;
      os?: string;
      browser?: string;
      images: ImageInfo[];
    };
  }) {
    // 1. 기존 데이터 조회
    const existingRequest = await this.requestRepository.findById(
      params.requestId,
    );

    if (!existingRequest) {
      throw new Error("요청을 찾을 수 없습니다.");
    }

    // 2. 권한 검증: 작성자 본인 확인
    if (existingRequest.userId.toString() !== params.userId) {
      throw new Error("본인의 요청만 수정할 수 있습니다.");
    }

    // 3. 비즈니스 규칙 검증: 이미 답변이 달린 경우 수정 제한 (선택 사항)
    if (existingRequest.status === REQUEST_STATUS.COMPLETED) {
      throw new Error("이미 답변이 작성된 문의는 수정할 수 없습니다.");
    }

    const request = await this.requestRepository.updateUserRequest({
      requestId: params.requestId,
      title: params.title,
      content: params.content,
      metadata: params.metadata,
    });

    console.log("업데이트반환 값", request);

    if (!request) {
      throw new Error("수정에 실패했습니다.");
    }

    // 4. 레포지토리 호출하여 업데이트
    return toRequestDto(request);
  }
}
