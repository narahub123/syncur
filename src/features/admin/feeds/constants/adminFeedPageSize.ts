import { AdminFeedPageSize } from "../types";

export const ADMIN_FEED_PAGE_SIZE_OPTIONS: {
  value: AdminFeedPageSize;
  label: string;
}[] = [
  { value: 10, label: "10개" },
  { value: 20, label: "20개" },
  { value: 50, label: "50개" },
  { value: 100, label: "100개" },
];
