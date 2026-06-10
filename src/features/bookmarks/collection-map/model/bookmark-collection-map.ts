import { Schema, model, Types, Document, models } from "mongoose";

/**
 * BookmarkCollectionMap Document
 *
 * 북마크된 FeedItem과 Collection 간의 연결 테이블
 *
 * 역할:
 * - FeedItem ↔ Collection N:M 관계 해소
 * - 하나의 FeedItem이 여러 컬렉션에 포함될 수 있음
 * - 컬렉션별 북마크 분류 기능 제공
 */
export interface BookmarkCollectionMapDocument extends Document {
  /**
   * mapping ID
   */
  _id: Types.ObjectId;

  /**
   * 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * 북마크된 FeedItem ID
   */
  feedItemId: Types.ObjectId;

  /**
   * 연결된 컬렉션 ID
   */
  collectionId: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const BookmarkCollectionMapSchema = new Schema<BookmarkCollectionMapDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    feedItemId: {
      type: Schema.Types.ObjectId,
      ref: "FeedItem",
      required: true,
      index: true,
    },

    collectionId: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 중복 방지:
 * 같은 FeedItem이 같은 Collection에 중복 저장되는 것 방지
 */
BookmarkCollectionMapSchema.index(
  { userId: 1, feedItemId: 1, collectionId: 1 },
  { unique: true },
);

export const BookmarkCollectionMapModel =
  models.BookmarkCollectionMap ||
  model<BookmarkCollectionMapDocument>(
    "BookmarkCollectionMap",
    BookmarkCollectionMapSchema,
  );
