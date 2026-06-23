import { InquiryStatus } from "@/features/admin/inquiries/types/search";
import { InquiryStatsRepository } from "../repository/InquiryStatsRepository";
import { InquiryStatsDTO } from "../dto/inquiryStatDTO";

export class InquiryStatsService {
  private statsRepository: InquiryStatsRepository;

  constructor() {
    this.statsRepository = new InquiryStatsRepository();
  }

  /**
   * 1. 일반 문의 신규 접수 시 (Create Event)
   */
  async handleInquiryCreated(status: InquiryStatus = "PENDING"): Promise<void> {
    await this.statsRepository.incrementCount(status, 1);
  }

  /**
   * 2. 일반 문의 상태 변경 시 (Update Status Event)
   */
  async handleInquiryStatusChanged(
    oldStatus: InquiryStatus,
    newStatus: InquiryStatus,
  ): Promise<void> {
    await this.statsRepository.transitCount(oldStatus, newStatus);
  }

  /**
   * 3. 일반 문의 삭제 시 (Delete Event)
   */
  async handleInquiryDeleted(status: InquiryStatus): Promise<void> {
    await this.statsRepository.incrementCount(status, -1);
  }

  /**
   * 4. 대시보드 오버뷰 최종 조회 (DTO 반환)
   */
  async getInquiryOverview(): Promise<InquiryStatsDTO | null> {
    const stats = await this.statsRepository.findByKey("inquiry_overview");
    if (!stats) return null;

    return {
      total: stats.total,
      pending: stats.pending,
      processing: stats.processing,
      completed: stats.completed,
    };
  }
}
