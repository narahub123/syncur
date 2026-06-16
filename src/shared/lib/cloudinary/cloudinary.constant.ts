export const CLOUDINARY_FOLDERS = {
  NOTICES: "syncur/notices",
  PROFILES: "syncur/profiles",
  INQUIRIES: "syncur/inquiries",
  BUG_REPORTS: "syncur/bug-reports",
  DEFAULT: "syncur/",
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
