export const CLOUDINARY_FOLDERS = {
  NOTICES: "syncur/notices",
  PROFILES: "syncur/profiles",
  INQUIRIES: "syncur/inquiries",
  INQUIRY_REPLIES: "syncur/inquiry-replies",
  BUG_REPORTS: "syncur/bug-reports",
  BUG_REPORT_REPLIES: "syncur/bug-report-replies",
  DEFAULT: "syncur/",
} as const;

export type CloudinaryFolder =
  (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];
