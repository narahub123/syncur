import { Schema, model, models } from "mongoose";

/**
 * 사용자 정보.
 *
 * NextAuth MongoDBAdapter가 생성하는 users 컬렉션과 연결된다.
 *
 * 저장 정보:
 * - name: 사용자 이름
 * - email: 사용자 이메일 (고유값)
 * - emailVerified: 이메일 인증 시각
 * - image: 프로필 이미지 URL
 */
const userSchema = new Schema(
  {
    /**
     * 사용자 이름.
     *
     * Google OAuth 로그인 시
     * Google 계정 이름이 저장된다.
     */
    name: {
      type: String,
      default: null,
    },

    /**
     * 사용자 이메일.
     *
     * 사용자 식별에 사용하는 핵심 값이다.
     */
    email: {
      type: String,
      required: true,
      unique: true,
    },

    /**
     * 이메일 인증 완료 시각.
     *
     * 현재 Google OAuth만 사용하므로
     * 대부분 null 상태로 저장된다.
     */
    emailVerified: {
      type: Date,
      default: null,
    },

    /**
     * 사용자 프로필 이미지 URL.
     *
     * Google OAuth 로그인 시
     * Google 프로필 이미지가 저장된다.
     */
    image: {
      type: String,
      default: null,
    },
  },
  {
    /**
     * NextAuth가 관리하는 users 컬렉션을 사용한다.
     */
    collection: "users",

    /**
     * createdAt, updatedAt을 생성하지 않는다.
     *
     * NextAuth 기본 users 컬렉션 구조와 맞춘다.
     */
    timestamps: false,
  },
);

const User = models.User || model("User", userSchema);

export default User;
