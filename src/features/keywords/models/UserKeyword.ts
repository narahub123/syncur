import mongoose, { Schema, Types, Document } from "mongoose";

/**
 * UserKeyword Document
 */
export interface UserKeywordDocument extends Document {
  /**
   * 키워드 등록 사용자 ID
   */
  userId: Types.ObjectId;

  /**
   * 사용자에게 표시되는 원본 키워드
   *
   * 예)
   * React
   * Next.js
   * AI
   */
  displayKeyword: string;

  /**
   * 매칭용 정규화 키워드
   *
   * - trim
   * - lowercase
   *
   * 예)
   * React   -> react
   * AI      -> ai
   * Next.js -> next.js
   */
  keyword: string;

  /**
   * 활성화 여부
   *
   * false일 경우 키워드 매칭에서 제외
   */
  isActive: boolean;

  /**
   * 생성일시
   */
  createdAt: Date;

  /**
   * 수정일시
   */
  updatedAt: Date;
}

/**
 * UserKeyword Schema
 */
const UserKeywordSchema = new Schema<UserKeywordDocument>(
  {
    /**
     * 키워드 등록 사용자
     */
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * 사용자에게 표시되는 원본 키워드
     */
    displayKeyword: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    /**
     * 매칭용 정규화 키워드
     */
    keyword: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },

    /**
     * 활성화 여부
     *
     * false일 경우 키워드 매칭에서 제외
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

/**
 * 사용자별 활성 키워드 조회
 */
UserKeywordSchema.index({
  userId: 1,
  isActive: 1,
});

/**
 * 동일 사용자의 중복 키워드 방지
 *
 * keyword는 lowercase로 저장되므로
 * AI / ai / Ai 는 동일 키워드로 취급된다.
 */
UserKeywordSchema.index(
  {
    userId: 1,
    keyword: 1,
  },
  {
    unique: true,
  },
);

export const UserKeywordModel =
  mongoose.models.UserKeyword ||
  mongoose.model<UserKeywordDocument>("UserKeyword", UserKeywordSchema);
