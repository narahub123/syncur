import { InferSchemaType, Schema, model, models } from "mongoose";

/**
 * 사용자 관심사 프로필
 *
 * 목적:
 * - 온보딩에서 선택한 관심사를 저장한다.
 * - 추천 시스템의 기본 선호도를 관리한다.
 *
 * 주의:
 * - 현재는 사용자가 직접 선택한 관심사만 저장한다.
 * - 행동 기반 점수(클릭, 좋아요, 북마크 등)는
 *   추천 시스템 구현 시 별도 모델 또는 필드로 확장한다.
 */
const UserInterestProfileSchema = new Schema(
  {
    /**
     * 사용자 식별자
     *
     * NextAuth session.user.email 기준으로 관리한다.
     */
    userEmail: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /**
     * 사용자가 선택한 카테고리 ID 목록
     *
     * 현재는 서비스에서 제공하는 프리셋 카테고리 ID만 저장한다.
     *
     * 추후 사용자가 직접 카테고리를 생성할 수 있게 되면
     * Category 컬렉션을 분리하고 해당 컬렉션의 ID를 참조하도록 확장할 수 있다.
     */
    categoryIds: {
      type: [String],
      default: [],
    },

    /**
     * 사용자가 선택한 관심사 ID 목록
     *
     * 현재는 서비스에서 제공하는 프리셋 관심사 ID만 저장한다.
     *
     * 추후 사용자가 직접 관심사를 생성할 수 있게 되면
     * Interest 컬렉션을 분리하고 해당 컬렉션의 ID를 참조하도록 확장할 수 있다.
     */
    interestIds: {
      type: [String],
      default: [],
    },
  },
  {
    collection: "user_interest_profiles",
    timestamps: true,
    versionKey: false,
  },
);

export type UserInterestProfileType = InferSchemaType<
  typeof UserInterestProfileSchema
>;

const UserInterestProfile =
  models.UserInterestProfile ||
  model("UserInterestProfile", UserInterestProfileSchema);

export default UserInterestProfile;
