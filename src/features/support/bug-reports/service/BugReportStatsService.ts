import { BugReportStatus } from "@/features/admin/bug-reports/types/search";
import { BugReportStatsRepository } from "../repository/BugReportStatsRepository";
import { BugReportStatsDTO } from "../dto/bugReportStatsDTO";

export class BugReportStatsService {
  private statsRepository: BugReportStatsRepository;

  constructor() {
    this.statsRepository = new BugReportStatsRepository();
  }

  /**
   * 1. 버그 리포트 신규 접수 시 (Create Event)
   */
  async handleBugReportCreated(
    status: BugReportStatus = "PENDING",
  ): Promise<void> {
    await this.statsRepository.incrementCount(status, 1);
  }

  /**
   * 2. 버그 리포트 상태 변경 시 (Update Status Event)
   */
  async handleBugReportStatusChanged(
    oldStatus: BugReportStatus,
    newStatus: BugReportStatus,
  ): Promise<void> {
    await this.statsRepository.transitCount(oldStatus, newStatus);
  }

  /**
   * 3. 버그 리포트 삭제 시 (Delete Event)
   */
  async handleBugReportDeleted(status: BugReportStatus): Promise<void> {
    await this.statsRepository.incrementCount(status, -1);
  }

  /**
   * 4. 대시보드 오버뷰 최종 조회 (차트 조립 DTO)
   */
  async getBugReportOverview(): Promise<BugReportStatsDTO | null> {
    const stats = await this.statsRepository.findByKey("bug_report_overview");
    if (!stats) return null;

    return {
      total: stats.total,
      completed: stats.completed,
      fixing: stats.fixing,
      checking: stats.checking,
      pending: stats.pending,
    };
  }
}
