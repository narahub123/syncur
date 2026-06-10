import { Schema, model, Types, Document, models } from "mongoose";

/**
 * BookmarkCollection Document
 *
 * 사용자가 생성하는 북마크 폴더(카테고리)
 *
 * 역할:
 * - 북마크 그룹화 (AI, 뉴스, 공부 등)
 * - 사용자 개인 단위 관리
 * - FeedItem과 N:M 관계를 구성하는 기준 엔티티
 */
export interface BookmarkCollectionDocument extends Document {
  /**
   * 컬렉션 ID
   */
  _id: Types.ObjectId;

  /**
   * 컬렉션 소유자
   */
  userId: Types.ObjectId;

  /**
   * 컬렉션 이름
   */
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

const BookmarkCollectionSchema = new Schema<BookmarkCollectionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 동일 유저 내 컬렉션 이름 중복 방지
 */
BookmarkCollectionSchema.index({ userId: 1, name: 1 }, { unique: true });

/**
 * 검색 성능 최적화
 */
BookmarkCollectionSchema.index({ name: 1 });

/**
 * 최신순 정렬 최적화
 */
BookmarkCollectionSchema.index({ createdAt: -1 });

export const BookmarkCollectionModel =
  models.BookmarkCollection ||
  model<BookmarkCollectionDocument>(
    "BookmarkCollection",
    BookmarkCollectionSchema,
  );
