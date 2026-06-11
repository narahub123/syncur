import { AdminFeedSearchField } from "../types";

export const ADMIN_FEED_SEARCH_FIELD_OPTIONS: {
  value: AdminFeedSearchField;
  label: string;
}[] = [
  {
    value: "siteName",
    label: "사이트명",
  },
  {
    value: "siteUrl",
    label: "사이트 URL",
  },
  {
    value: "status",
    label: "상태",
  },
  {
    value: "category",
    label: "카테고리",
  },
];
