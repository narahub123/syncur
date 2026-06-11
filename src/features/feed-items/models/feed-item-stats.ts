import { Schema, Types, model, models } from "mongoose";

/**
 * FeedItemStats Document
 *
 * FeedItem 단위로 발생한 사용자 행동을 집계하는 컬렉션
 *
 * 역할:
 * - RSS FeedItem에 대한 전체 사용자 반응을 누적 저장
 * - 인기/트렌딩/분석의 기반 데이터
 *
 * 특징:
 * - userId 없음 (완전 집계 데이터)
 * - append가 아닌 increment 기반 상태 저장
 */
export interface FeedItemStatsDocument extends Document {
  /**
   * 집계 대상 FeedItem
   *
   * - 1 FeedItem = 1 Stats document
   * - unique constraint 대상
   */
  feedItemId: Types.ObjectId;

  /**
   * 콘텐츠(기사 원문) 클릭 수
   *
   * - 실제 콘텐츠 소비 행동
   * - 추천/인기 계산에서 가장 중요한 signal
   */
  contentClickCount: number;

  /**
   * 사이트(출처) 클릭 수
   *
   * - RSS source 또는 site navigation 이동
   * - 콘텐츠 소비가 아닌 탐색 행동
   */
  sourceClickCount: number;

  /**
   * 좋아요 수
   *
   * - 콘텐츠에 대한 명시적 긍정 반응
   */
  likeCount: number;

  /**
   * 북마크 수
   *
   * - 재방문 의도 (strong intent signal)
   */
  bookmarkCount: number;

  /**
   * 공유 수
   *
   * - 외부 확산 신호 (virality signal)
   */
  shareCount: number;

  /**
   * 마지막 상호작용 시각
   *
   * - 최신성 기반 정렬 및 분석에 사용
   */
  lastInteractedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const FeedItemStatsSchema = new Schema<FeedItemStatsDocument>(
  {
    feedItemId: {
      type: Schema.Types.ObjectId,
      ref: "FeedItem",
      required: true,
    },

    contentClickCount: {
      type: Number,
      default: 0,
    },

    sourceClickCount: {
      type: Number,
      default: 0,
    },

    likeCount: {
      type: Number,
      default: 0,
    },

    bookmarkCount: {
      type: Number,
      default: 0,
    },

    shareCount: {
      type: Number,
      default: 0,
    },

    lastInteractedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * Index Strategy
 *
 * - feedItem 단위 빠른 조회
 * - 최신 업데이트 기반 정렬
 */
FeedItemStatsSchema.index({ feedItemId: 1 }, { unique: true });
FeedItemStatsSchema.index({ updatedAt: -1 });
FeedItemStatsSchema.index({ lastInteractedAt: -1 });

export const FeedItemStatsModel =
  models.FeedItemStats ||
  model<FeedItemStatsDocument>("FeedItemStats", FeedItemStatsSchema);
