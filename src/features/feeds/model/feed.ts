import { AdminDashboardStatsModel } from "@/features/admin/dashboard/model/AdminDashboardStats";
import {
  HTML_SITE_TYPE,
  HtmlSiteType,
} from "@/features/ingestion/lib/detectors/types";
import {
  DetailPageConfig,
  ListingPageConfig,
} from "@/features/ingestion/lib/discover/types";
import { FeedStatus } from "@/shared/types/feed";
import mongoose, { Schema, Document, Types } from "mongoose";

export type FeedSourceType = "rss" | "crawl";

export type CrawlerConfig = {
  htmlType: HtmlSiteType;
};

export interface CrawlerState {
  lastSeenUrl: string | null;
  lastCrawledAt: Date | null;
}

/**
 * Feed Document
 *
 * - RSS 또는 크롤링 기반 수집 단위
 * - RSS: Site당 1개
 * - Crawl: Site당 목록 페이지 수만큼 생성
 */
export interface FeedDocument extends Document {
  /**
   * 연결된 Site
   */
  siteId: Types.ObjectId;

  /**
   * Feed 고유 식별자
   *
   * 포맷: {sourceType}:{normalizedUrl}
   * 예:
   * rss:https://velog.io/rss
   * crawl:https://seoul.go.kr/news/list.do
   */
  uniqueKey: string;

  /**
   * 수집 방식
   * - rss: RSS/Atom Feed 기반
   * - crawl: 목록 페이지 크롤링 기반
   */
  sourceType: FeedSourceType;

  /**
   * 피드 이름
   */
  name: string;

  /**
   * RSS/Atom Feed URL
   *
   * - sourceType이 "rss"일 때만 사용
   */
  feedUrl: string | null;

  /**
   * 크롤링 대상 목록 페이지 URL
   *
   * - sourceType이 "crawl"일 때만 사용
   */
  listingPageUrl: string | null;

  crawlerConfig?: CrawlerConfig;

  /**
   * 목록 페이지 파싱 config
   *
   * - sourceType이 "crawl"일 때만 사용
   * - 새 글 감지에 필요한 정보
   */
  listingPageConfig: ListingPageConfig | null;

  /**
   * 상세 페이지 파싱 config
   *
   * - sourceType이 "crawl"일 때만 사용
   * - feedItem 추출에 필요한 정보
   */
  detailPageConfig: DetailPageConfig | null;

  /**
   * 크롤링 상태
   *
   * - sourceType이 "crawl"일 때만 사용
   * - 새 글 감지 기준
   */
  crawlerState: CrawlerState;

  /**
   * Feed 상태
   */
  status: FeedStatus;

  /**
   * 마지막 성공적인 fetch 시각
   */
  lastFetchedAt: Date | null;

  /**
   * HTTP 캐싱 (ETag) — RSS 전용
   */
  etag: string | null;

  /**
   * HTTP 캐싱 (Last-Modified) — RSS 전용
   */
  lastModified: string | null;

  /**
   * 연속 실패 횟수
   */
  errorCount: number;

  /**
   * Feed 카테고리
   */
  categories: string[];

  /**
   * 구독자 수
   */
  subscriberCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const FeedSchema = new Schema<FeedDocument>(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      // unique 제거 — 사이트당 Feed 여러 개 가능
    },

    uniqueKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    sourceType: {
      type: String,
      enum: ["rss", "crawl"],
      required: true,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    feedUrl: {
      type: String,
      default: null,
      trim: true,
    },

    listingPageUrl: {
      type: String,
      default: null,
      trim: true,
    },

    crawlerConfig: {
      type: {
        htmlType: {
          type: String,
          enum: Object.values(HTML_SITE_TYPE),
          required: true,
        },
      },
      _id: false, // 추가
      required: false,
      default: undefined,
    },

    listingPageConfig: {
      type: Schema.Types.Mixed,
      default: null,
    },

    detailPageConfig: {
      type: Schema.Types.Mixed,
      default: null,
    },

    crawlerState: {
      lastSeenUrl: { type: String, default: null },
      lastCrawledAt: { type: Date, default: null },
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

    categories: {
      type: [String],
      default: [],
    },

    subscriberCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// =====================
// Index
// =====================

FeedSchema.index({ siteId: 1 });
FeedSchema.index({ status: 1, lastFetchedAt: 1 });
FeedSchema.index({ sourceType: 1, status: 1 });
FeedSchema.index({ categories: 1 });

// =====================
// AdminDashboardStats 동기화 미들웨어
// =====================

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

FeedSchema.post("findOneAndUpdate", async function () {
  try {
    const total = await this.model.countDocuments();
    const active = await this.model.countDocuments({ status: "active" });
    const inactive = total - active;

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

export const FeedModel =
  mongoose.models.Feed || mongoose.model<FeedDocument>("Feed", FeedSchema);
