import { InquiryStatus } from "@/features/admin/inquiries/types/search"; // 🎯 프로젝트 위치에 맞게 임포트 경로 확인
import { InquiryStatsDocument, InquiryStatsModel } from "../model/InquiryStats";
import { INQUIRY_STATS_KEY } from "../constants/stats"; // "inquiry_overview"가 정의된 곳

export class InquiryStatsRepository {
  /**
   * 고유 키를 기반으로 Inquiry 통계 스냅샷 단건 조회
   */
  async findByKey(
    key: string = INQUIRY_STATS_KEY,
  ): Promise<InquiryStatsDocument | null> {
    return await InquiryStatsModel.findOne({ key }).lean();
  }

  /**
   * 특정 상태의 카운트를 증가(+1) 또는 감소(-1) 시키는 원자적 연산
   * @param status 변경할 문의 상태
   * @param amount 증가치 (+1 또는 -1)
   */
  async incrementCount(status: InquiryStatus, amount: number): Promise<void> {
    // Inquiry 상태 3가지에 매핑되는 스키마 필드 식별
    const fieldMap: Record<InquiryStatus, string> = {
      PENDING: "pending",
      PROCESSING: "processing",
      COMPLETED: "completed",
    };

    const targetField = fieldMap[status];
    if (!targetField) return;

    await InquiryStatsModel.findOneAndUpdate(
      { key: INQUIRY_STATS_KEY },
      {
        $inc: {
          total: amount, // 총 개수 세트로 증감
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
    oldStatus: InquiryStatus,
    newStatus: InquiryStatus,
  ): Promise<void> {
    if (oldStatus === newStatus) return;

    const fieldMap: Record<InquiryStatus, string> = {
      PENDING: "pending",
      PROCESSING: "processing",
      COMPLETED: "completed",
    };

    const oldField = fieldMap[oldStatus];
    const newField = fieldMap[newStatus];

    if (!oldField || !newField) return;

    await InquiryStatsModel.findOneAndUpdate(
      { key: INQUIRY_STATS_KEY },
      {
        $inc: {
          [oldField]: -1, // 기존 상태 감소
          [fieldMap[newStatus]]: 1, // 신규 상태 증가
          // 상태 간 이동이므로 total(총 개수)은 유지
        },
      },
      { upsert: true },
    );
  }
}
