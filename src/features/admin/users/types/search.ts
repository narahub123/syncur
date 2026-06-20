import { SortOrder } from "@/shared/types/pagination";
import { FILTER_TYPES, FilterValue } from "@/features/admin/constants/filters";
import { USER_ROLE } from "@/features/users/constants/user-role";

/**
 * =========================
 * Search Field
 * =========================
 */
export const ADMIN_USER_SEARCH_FIELD = {
  NAME: "name",
  EMAIL: "email",
} as const;

export type AdminUserSearchField =
  (typeof ADMIN_USER_SEARCH_FIELD)[keyof typeof ADMIN_USER_SEARCH_FIELD];

export const ADMIN_USER_SEARCH_FIELD_LABELS: Record<
  AdminUserSearchField,
  string
> = {
  name: "이름",
  email: "이메일",
};

export const ADMIN_USER_SEARCH_FIELD_OPTIONS = Object.entries(
  ADMIN_USER_SEARCH_FIELD_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * =========================
 * Role
 * =========================
 */
export const ADMIN_USER_ROLE = {
  ADMIN: USER_ROLE.ADMIN,
  USER: USER_ROLE.USER,
} as const;

export type AdminUserRole =
  (typeof ADMIN_USER_ROLE)[keyof typeof ADMIN_USER_ROLE];

export const ADMIN_USER_ROLE_LABELS: Record<AdminUserRole, string> = {
  admin: "관리자",
  user: "일반 사용자",
};

export const ADMIN_USER_ROLE_OPTIONS = Object.entries(
  ADMIN_USER_ROLE_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * =========================
 * Onboarding
 * =========================
 */
export const ADMIN_USER_ONBOARDING = {
  COMPLETED: "completed",
  PENDING: "pending",
} as const;

export type AdminUserOnboarding =
  (typeof ADMIN_USER_ONBOARDING)[keyof typeof ADMIN_USER_ONBOARDING];

export const ADMIN_USER_ONBOARDING_LABELS: Record<AdminUserOnboarding, string> =
  {
    completed: "완료",
    pending: "진행중",
  };

export const ADMIN_USER_ONBOARDING_OPTIONS = Object.entries(
  ADMIN_USER_ONBOARDING_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * =========================
 * Sort
 * =========================
 */
export const ADMIN_USER_SORT = {
  NAME: "name",
  EMAIL: "email",
  ROLE: "role",
  ONBOARDING: "onboarding",
  CREATED_AT: "createdAt",
} as const;

export type AdminUserSort =
  (typeof ADMIN_USER_SORT)[keyof typeof ADMIN_USER_SORT];

export const ADMIN_USER_SORT_LABELS: Record<AdminUserSort, string> = {
  name: "이름순",
  email: "이메일순",
  role: "권한순",
  onboarding: "온보딩순",
  createdAt: "가입일순",
};

export const ADMIN_USER_SORT_OPTIONS = Object.entries(
  ADMIN_USER_SORT_LABELS,
).map(([value, label]) => ({
  value,
  label,
}));

/**
 * =========================
 * Page Size
 * =========================
 */
export const ADMIN_USER_PAGE_SIZE = {
  DEFAULT: 10,
  TWENTY: 20,
  FIFTY: 50,
  HUNDRED: 100,
} as const;

export type AdminUserPageSize =
  (typeof ADMIN_USER_PAGE_SIZE)[keyof typeof ADMIN_USER_PAGE_SIZE];

export const ADMIN_USER_PAGE_SIZE_OPTIONS = Object.entries(
  ADMIN_USER_PAGE_SIZE,
).map(([_, value]) => ({
  label: `${value}개`,
  value,
}));

/**
 * =========================
 * Initial Filter
 * =========================
 */
export const adminUserInitialFilterValue = {
  role: ["all"],
  onboarding: ["all"],
  createdAt: { start: null, end: null },
};

/**
 * =========================
 * Filter Config
 * =========================
 */
export const ADMIN_USER_FILTER_CONFIG = {
  role: {
    label: "권한",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      { label: "전체", value: "all" as const },
      ...ADMIN_USER_ROLE_OPTIONS,
    ],
  },

  onboarding: {
    label: "온보딩 상태",
    type: FILTER_TYPES.MULTI_SELECT,
    options: [
      { label: "전체", value: "all" as const },
      ...ADMIN_USER_ONBOARDING_OPTIONS,
    ],
  },

  createdAt: {
    label: "가입일",
    type: FILTER_TYPES.DATE_RANGE,
  },
} as const;

export type AdminUserFilterKey = keyof typeof ADMIN_USER_FILTER_CONFIG;

/**
 * =========================
 * Query
 * =========================
 */
export interface AdminUsersQuery {
  search: string;
  searchField: AdminUserSearchField;
  sort: AdminUserSort;
  sortOrder: SortOrder;
  page: number;
  limit: AdminUserPageSize;

  filters: Partial<Record<AdminUserFilterKey, FilterValue>>;
}
