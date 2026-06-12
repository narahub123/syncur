import {
  AdminFeedExecutionLogPageSize,
  AdminFeedExecutionLogSearchField,
} from "../types";

export const ADMIN_FEED_EXECUTION_LOG_SEARCH_FIELD_OPTIONS: {
  label: string;
  value: AdminFeedExecutionLogSearchField;
}[] = [{ label: "사이트", value: "siteName" }];

export const ADMIN_FEED_EXECUTION_LOG_PAGE_SIZE_OPTIONS: {
  label: string;
  value: AdminFeedExecutionLogPageSize;
}[] = [
  { label: "10개", value: 10 },
  { label: "20개", value: 20 },
  { label: "50개", value: 50 },
  { label: "100개", value: 100 },
];
