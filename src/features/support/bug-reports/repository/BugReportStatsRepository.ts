import { BugReportStatus } from "@/features/admin/bug-reports/types/search";
import {
  BugReportStatsDocument,
  BugReportStatsModel,
} from "../model/BugReportStats";
import { BUG_REPORT_STATS_KEY } from "../constants/stats";

export class BugReportStatsRepository {
  /**
   * 고유 키를 기반으로 통계 스냅샷 단건 조회
   */
  async findByKey(
    key: string = BUG_REPORT_STATS_KEY,
  ): Promise<BugReportStatsDocument | null> {
    return await BugReportStatsModel.findOne({ key }).lean();
  }

  /**
   * 특정 상태의 카운트를 증가(+1) 또는 감소(-1) 시키는 원자적 연산
   * @param status 변경할 버그 상태
   * @param amount 증가치 (+1 또는 -1)
   */
  async incrementCount(status: BugReportStatus, amount: number): Promise<void> {
    // 스키마 매핑 필드 식별 (상태 명칭과 스키마 필드명을 소문자로 매칭)
    const fieldMap: Record<BugReportStatus, string> = {
      PENDING: "pending",
      CHECKING: "checking",
      FIXING: "fixing",
      COMPLETED: "completed",
    };

    const targetField = fieldMap[status];
    if (!targetField) return;

    await BugReportStatsModel.findOneAndUpdate(
      { key: BUG_REPORT_STATS_KEY },
      {
        $inc: {
          total: amount, // 총 개수도 세트로 증감
          [targetField]: amount, // 해당 상태 필드 증감
        },
      },
      { upsert: true, new: true }, // 도큐먼트가 없으면 자동 생성(Upsert)
    );
  }

  /**
   * 상태 변경(전이) 시 기존 상태는 -1, 새 상태는 +1 시키는 복합 원자적 연산
   */
  async transitCount(
    oldStatus: BugReportStatus,
    newStatus: BugReportStatus,
  ): Promise<void> {
    if (oldStatus === newStatus) return;

    const fieldMap: Record<BugReportStatus, string> = {
      PENDING: "pending",
      CHECKING: "checking",
      FIXING: "fixing",
      COMPLETED: "completed",
    };

    await BugReportStatsModel.findOneAndUpdate(
      { key: BUG_REPORT_STATS_KEY },
      {
        $inc: {
          [fieldMap[oldStatus]]: -1, // 기존 상태 감소
          [fieldMap[newStatus]]: 1, // 신규 상태 증가
          // 상태 전이 시 총 개수(total)는 변함이 없으므로 건드리지 않음
        },
      },
      { upsert: true },
    );
  }
}
