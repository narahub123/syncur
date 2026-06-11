export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export type UserRoleMeta = {
  label: string;
};

export const USER_ROLE_META: Record<UserRole, UserRoleMeta> = {
  user: { label: "사용자" },
  admin: { label: "관리자" },
} as const;
