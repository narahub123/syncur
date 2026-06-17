import {
  AdminRequestSearchField,
  AdminRequestSort,
} from "../types/admin-search";

export const ADMIN_REQUEST_SEARCH_FIELD_OPTIONS: {
  label: string;
  value: AdminRequestSearchField;
}[] = [
  { label: "제목", value: "title" },
  { label: "내용", value: "content" },
  { label: "유저 이메일", value: "userEmail" },
];

export const ADMIN_REQUEST_SORT_OPTIONS: {
  label: string;
  value: AdminRequestSort;
}[] = [
  { label: "제목", value: "title" },
  { label: "유형", value: "type" },
  { label: "상태", value: "status" },
  { label: "등록일", value: "createdAt" },
];

export const ADMIN_REQUEST_PAGE_SIZE_OPTIONS = [
  { label: "10개", value: 10 as const },
  { label: "20개", value: 20 as const },
  { label: "50개", value: 50 as const },
];
