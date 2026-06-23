import { AdminDashboardStatsModel } from "@/features/admin/dashboard/model/AdminDashboardStats";
import { FeedStatus } from "@/shared/types/feed";
import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * Feed Document
 *
 * - 실제 RSS/Atom ingestion 대상
 * - Site에서 RSS 검증 성공 시 생성됨
 * - 해당 Feed는 cron에 의해 지속적으로 데이터를 수집함
 */
export interface FeedDocument extends Document {
  siteId: Types.ObjectId;

  /**
   * 실제 RSS/Atom URL
   *
   * - ingestion의 핵심 source
   * - Site에서 추출된 feed_url 기반
   */
  feedUrl: string;

  /**
   * Feed 상태
   *
   * - active: 정상 수집 중
   * - error: 일시적 실패 상태
   * - disabled: 더 이상 수집하지 않음
   */
  status: FeedStatus;

  /**
   * 마지막 성공적인 RSS fetch 시각
   *
   * - cron scheduling 기준으로 사용
   */
  lastFetchedAt?: Date;

  /**
   * HTTP 캐싱 (ETag)
   *
   * - RSS 서버 변경 여부 확인용
   * - 변경 없으면 parsing skip 가능
   */
  etag?: string;

  /**
   * HTTP 캐싱 (Last-Modified)
   *
   * - RSS 변경 감지 최적화
   */
  lastModified?: string;

  /**
   * 연속 실패 횟수
   *
   * - 일정 threshold 이상이면 disabled 처리
   */
  errorCount: number;

  /**
   * Feed 전체 카테고리
   *
   * - 해당 RSS가 주로 다루는 주제 영역
   * - FeedItem categories보다 상위/집계 개념
   *
   * 예:
   * ["tech", "ai", "news"]
   */
  categories: string[];

  /**
   * 구독자 수
   */
  subscriberCount: number;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * 누적 구독 횟수 (성장 지표)
 * - 신규 + 재구독을 포함한 총 구독 성공 횟수
 */
// totalSubscriptionCount: { type: Number, default: 0 },

/**
 * 누적 해지 횟수 (이탈 지표)
 * - 총 해지 횟수
 */
// totalUnsubscriptionCount: { type: Number, default: 0 },

/**
 * 일일 구독자 증감 (트렌드 지표)
 * - 매일 배치 작업으로 업데이트
 */
// dailyDelta: { type: Number, default: 0 },

const FeedSchema = new Schema<FeedDocument>(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      unique: true, // Site당 Feed 1개 구조
    },

    feedUrl: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },

    lastFetchedAt: {
      type: Date,
      default: null,
    },

    etag: {
      type: String,
      default: null,
    },

    lastModified: {
      type: String,
      default: null,
    },

    errorCount: {
      type: Number,
      default: 0,
    },

    /**
     * Feed 전체 카테고리
     *
     * - RSS item 기반 aggregation 결과
     * - 또는 Site discovery 시점에 초기 설정
     * - Feed 전체 성격을 나타내는 대표 태그
     */
    categories: {
      type: [String],
      default: [],
    },

    /**
     * 구독자 수 (캐싱 필드)
     */
    subscriberCount: {
      type: Number,
      default: 0,
      min: 0, // 구독자 수가 음수가 되는 것을 방지
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Index
 */
FeedSchema.index({ status: 1, lastFetchedAt: 1 });
FeedSchema.index({ categories: 1 });

// =========================================================================
// 🛠️ AdminDashboardStats 동기화를 위한 Mongoose 미들웨어 (Hooks)
// =========================================================================

/**
 * 1️⃣ 신규 Feed가 단건 저장(save)된 직후 대시보드 통계 증가
 */
FeedSchema.post("save", async function (doc) {
  const isActive = doc.status === "active";

  await AdminDashboardStatsModel.updateOne(
    { key: "dashboard_overview" },
    {
      $inc: {
        "feeds.total": 1,
        "feeds.active": isActive ? 1 : 0,
        "feeds.inactive": isActive ? 0 : 1,
      },
    },
    { upsert: true },
  );
});

/**
 * 2️⃣ Feed의 상태가 활성 <-> 비활성으로 변경되거나 배치 업서트가 일어난 직후 처리 (findOneAndUpdate 대응)
 * - 크롤러나 어드민 액션에 의해 특정 피드가 disabled로 전환될 때 전체 상태 밸런스를 동기화합니다.
 */
FeedSchema.post("findOneAndUpdate", async function () {
  try {
    // 현재 Feed 컬렉션의 실제 상태별 도큐먼트 개수 집계
    const total = await this.model.countDocuments();
    const active = await this.model.countDocuments({ status: "active" });
    const inactive = total - active;

    // 대시보드 통계판 최신화
    await AdminDashboardStatsModel.updateOne(
      { key: "dashboard_overview" },
      {
        $set: {
          "feeds.total": total,
          "feeds.active": active,
          "feeds.inactive": inactive,
        },
      },
      { upsert: true },
    );
  } catch (error) {
    console.error("대시보드 피드 통계 동기화 실패 (findOneAndUpdate):", error);
  }
});

// =========================================================================

export const FeedModel =
  mongoose.models.Feed || mongoose.model<FeedDocument>("Feed", FeedSchema);
