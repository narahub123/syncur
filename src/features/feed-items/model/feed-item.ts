import mongoose, { Schema, Document, Types } from "mongoose";

/**
 * FeedItem Document
 *
 * RSS/Atom 피드에서 수집된 개별 콘텐츠를 저장하는 컬렉션
 * Feed 단위로 ingestion 되며, 중복 방지를 위해 guid/hash 기반 dedup 구조를 사용
 */
export interface FeedItemDocument extends Document {
  /**
   * 이 아이템이 속한 Feed
   *
   * - ingestion 단위 기준
   * - Site가 아닌 Feed 기준으로 연결됨
   */
  feedId: Types.ObjectId;

  /**
   * RSS에서 제공하는 고유 ID
   *
   * - 가장 안정적인 unique key
   * - RSS 표준 guid 또는 atom:id 대응
   * - 존재할 경우 dedup 1순위 기준
   */
  guid?: string;

  /**
   * 원본 콘텐츠 링크
   *
   * - RSS item의 canonical URL
   * - guid가 없을 경우 fallback 식별자 역할
   */
  link: string;

  /**
   * 콘텐츠 제목
   *
   * - RSS title
   */
  title: string;

  /**
   * 요약 설명 (optional)
   *
   * - RSS description / summary field
   * - 짧은 preview 데이터
   */
  description?: string;

  /**
   * 본문 콘텐츠 (optional)
   *
   * - RSS content:encoded 또는 full text
   * - description보다 상세한 원문 데이터
   */
  content?: string;

  /**
   * 작성자 정보 (optional)
   *
   * - RSS author / dc:creator
   */
  author?: string;

  /**
   * 발행 시각
   *
   * - RSS pubDate / published
   * - 정렬 및 최신순 피드 구성에 사용
   */
  publishedAt?: Date;

  /**
   * RSS category + 내부 확장 태그
   *
   * 구성:
   * - RSS 원본 category
   * - 사이트 제공 tag
   * - 내부 분석 기반 태그 (향후 확장)
   *
   * 예:
   * ["tech", "ai", "openai"]
   */
  categories: string[];

  /**
   * 중복 제거용 해시값
   *
   * - guid가 없을 때 fallback dedup 키
   * - RSS에서는 link를 canonical key로 사용
   * - 동일 feed 내 item uniqueness 기준
   */
  hash: string;

  createdAt: Date;
  updatedAt: Date;
}

const FeedItemSchema = new Schema<FeedItemDocument>(
  {
    feedId: {
      type: Schema.Types.ObjectId,
      ref: "Feed",
      required: true,
    },

    guid: {
      type: String,
      default: null,
      index: true,
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: null,
    },

    content: {
      type: String,
      default: null,
    },

    author: {
      type: String,
      default: null,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    categories: {
      type: [String],
      default: [],
    },

    hash: {
      type: String,
      required: true, // fallback dedup key (link 기반)
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Dedup Index 전략
 *
 * 1. guid 기반 (RSS 표준 ID)
 * 2. hash 기반 (fallback)
 */
FeedItemSchema.index({ feedId: 1, guid: 1 }, { unique: true, sparse: true });
FeedItemSchema.index({ feedId: 1, hash: 1 }, { unique: true });
FeedItemSchema.index({ feedId: 1, publishedAt: -1 });
FeedItemSchema.index({ categories: 1 });

export const FeedItemModel =
  mongoose.models.FeedItem ||
  mongoose.model<FeedItemDocument>("FeedItem", FeedItemSchema);
