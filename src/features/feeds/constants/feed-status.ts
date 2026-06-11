export const FEED_STATUS = {
  ACTIVE: "active",
  DISABLED: "disabled",
} as const;

export const FEED_STATUS_OPTIONS = [
  { label: "활성", value: FEED_STATUS.ACTIVE },
  { label: "비활성", value: FEED_STATUS.DISABLED },
];
