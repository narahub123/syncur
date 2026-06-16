export const CLOUDINARY_FOLDERS = {
  NOTICES: "notices",
  PROFILES: "profiles",
  POSTS: "posts",
  DEFAULT: "default", // 💡 여기 추가
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
