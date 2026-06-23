import { InquiryRepository } from "../repositories/InquiryRepository";
import { InquiryQuery, InquiryStatus } from "../types/search";
import { AdminInquiryResponseDTO } from "../dto/inquiryDto";
import {
  toAdminInquiryDto,
  toAdminInquiryDtos,
} from "../mappers/toAdminInquiryDto";
import { RequestWithUserAndAdminLean } from "@/features/support/requests/types/admin-search";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { RequestResponseDTO } from "@/features/support/requests/dtos";
import { toRequestDto } from "@/features/support/requests/mappers/toRequestDto";
import { InquiryStatsService } from "@/features/support/inquiries/service/InquiryStatsService";
import { DashboardResponse } from "../../sites/types/stats";
import { InquiryStatsDTO } from "@/features/support/inquiries/dto/inquiryStatDTO";
import { defaultInquiryStats } from "@/features/support/inquiries/constants/stats";

export class InquiryService {
  private readonly inquiryStatsService = new InquiryStatsService();
  constructor(private readonly inquiryRepository: InquiryRepository) {}

  async getInquiriesForAdmin(
    query: InquiryQuery,
  ): Promise<DashboardResponse<AdminInquiryResponseDTO, InquiryStatsDTO>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, totalCount } =
      await this.inquiryRepository.findAllPaginatedForAdmin({
        ...query,
        page,
        limit,
      });

    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    const stats = await this.inquiryStatsService.getInquiryOverview();

    return {
      items: toAdminInquiryDtos(items),
      stats: stats || defaultInquiryStats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }

  /**
   * Inquiry 상세 조회 (Admin)
   */
  async getInquiryByIdForAdmin(
    inquiryId: string,
  ): Promise<AdminInquiryResponseDTO> {
    const inquiry: RequestWithUserAndAdminLean | null =
      await this.inquiryRepository.findByIdForAdmin(inquiryId);

    if (!inquiry) {
      throw new Error("존재하지 않는 문의입니다.");
    }

    return toAdminInquiryDto(inquiry);
  }

  /**
   * 관리자 답변 등록 (Inquiry 전용 + 실시간 통계 연동)
   */
  async replyToInquiry(params: {
    inquiryId: string;
    replyContent: string;
    images: ImageInfo[];
    adminId: string;
    status: InquiryStatus;
  }): Promise<RequestResponseDTO> {
    // 🎯 1. 상태 전이(비교)를 위해 업데이트 전 기존 도큐먼트의 상태를 먼저 확보합니다.
    const existingInquiry = await this.inquiryRepository.findById(
      params.inquiryId,
    );
    if (!existingInquiry) {
      throw new Error("존재하지 않는 문의입니다.");
    }

    const oldStatus = existingInquiry.status as InquiryStatus;

    // 2. 답변 등록 및 상태 업데이트 실행
    const updated = await this.inquiryRepository.submitAdminReply({
      inquiryId: params.inquiryId,
      replyContent: params.replyContent,
      images: params.images,
      repliedBy: params.adminId,
      status: params.status, // 신규 상태 (예: PROCESSING, COMPLETED)
    });

    if (!updated) {
      throw new Error("존재하지 않는 문의입니다.");
    }

    // 🎯 3. 상태가 실제로 변했을 때만 복합 원자적 연산(기존 상태 -1, 신규 상태 +1) 트리거
    if (oldStatus !== params.status) {
      await this.inquiryStatsService.handleInquiryStatusChanged(
        oldStatus,
        params.status,
      );
    }

    // TODO: SSE / Notification hook
    return toRequestDto(updated);
  }
}
