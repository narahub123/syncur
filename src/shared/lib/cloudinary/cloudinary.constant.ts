export const CLOUDINARY_FOLDERS = {
  NOTICES: "syncur/notices",
  PROFILES: "syncur/profiles",
  DEFAULT: "syncur/",
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
