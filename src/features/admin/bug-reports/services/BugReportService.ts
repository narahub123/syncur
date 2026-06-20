import { PaginatedResponse } from "@/shared/types/pagination";
import { BugReportRepository } from "../repositories/BugReportRepository";
import { BugReportQuery, BugReportStatus } from "../types/search";
import { AdminBugReportResponseDTO } from "../dto/bugReportDto";
import {
  toAdminBugReportDto,
  toAdminBugReportDtos,
} from "../mappers/toAdminBugReportDto";
import { RequestWithUserAndAdminLean } from "@/features/support/requests/types/admin-search";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { RequestResponseDTO } from "@/features/support/requests/dtos";
import { toRequestDto } from "@/features/support/requests/mappers/toRequestDto";

export class BugReportService {
  constructor(private readonly bugReportRepository: BugReportRepository) {}

  async getBugReportsForAdmin(
    query: BugReportQuery,
  ): Promise<PaginatedResponse<AdminBugReportResponseDTO>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const { items, totalCount } =
      await this.bugReportRepository.findAllPaginatedForAdmin({
        ...query,
        page,
        limit,
      });

    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    return {
      items: toAdminBugReportDtos(items),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }

  /**
   * 관리자 BugReport 상세 조회
   */
  async getBugReportByIdForAdmin(
    bugReportId: string,
  ): Promise<AdminBugReportResponseDTO> {
    const report: RequestWithUserAndAdminLean | null =
      await this.bugReportRepository.findByIdForAdmin(bugReportId);

    if (!report) {
      throw new Error("존재하지 않는 버그 신고입니다.");
    }

    return toAdminBugReportDto(report);
  }

  /**
   * 관리자 답변 등록 (BugReport 전용)
   */
  async replyToBugReport(params: {
    bugReportId: string;
    replyContent: string;
    images: ImageInfo[];
    adminId: string;
    status: BugReportStatus;
  }): Promise<RequestResponseDTO> {
    const updated = await this.bugReportRepository.submitAdminReply({
      bugReportId: params.bugReportId,
      replyContent: params.replyContent,
      images: params.images,
      repliedBy: params.adminId,
      status: params.status,
    });

    if (!updated) {
      throw new Error("존재하지 않는 버그 신고입니다.");
    }

    // TODO: SSE / Notification hook
    return toRequestDto(updated);
  }
}
