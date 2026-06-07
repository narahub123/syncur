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
  status: "active" | "error" | "disabled";

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

  createdAt: Date;
  updatedAt: Date;
}

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
      enum: ["active", "error", "disabled"],
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
      index: true,
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

export const FeedModel =
  mongoose.models.Feed || mongoose.model<FeedDocument>("Feed", FeedSchema);
