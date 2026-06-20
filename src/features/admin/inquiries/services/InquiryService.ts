import { PaginatedResponse } from "@/shared/types/pagination";
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

export class InquiryService {
  constructor(private readonly inquiryRepository: InquiryRepository) {}

  async getInquiriesForAdmin(
    query: InquiryQuery,
  ): Promise<PaginatedResponse<AdminInquiryResponseDTO>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, totalCount } =
      await this.inquiryRepository.findAllPaginatedForAdmin({
        ...query,
        page,
        limit,
      });

    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    return {
      items: toAdminInquiryDtos(items),
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
   * 관리자 답변 등록 (Inquiry 전용)
   */
  async replyToInquiry(params: {
    inquiryId: string;
    replyContent: string;
    images: ImageInfo[];
    adminId: string;
    status: InquiryStatus;
  }): Promise<RequestResponseDTO> {
    const updated = await this.inquiryRepository.submitAdminReply({
      inquiryId: params.inquiryId,
      replyContent: params.replyContent,
      images: params.images,
      repliedBy: params.adminId,
      status: params.status,
    });

    if (!updated) {
      throw new Error("존재하지 않는 문의입니다.");
    }

    // TODO: SSE / Notification hook
    return toRequestDto(updated);
  }
}
