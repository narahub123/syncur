import { ROUTES } from "@/shared/constants/routes";

export const SUPPORT_MENU = {
  CONTACT: "문의하기",
  BUG_REPORT: "오류 신고",
  REQUESTS: "내 문의",
  NOTICES: "공지사항",
  FAQ: "FAQ",
} as const;

export type SupportNavItem = {
  label: string;
  href: string;
};

export const SUPPORT_NAV_ITEMS: SupportNavItem[] = [
  {
    label: SUPPORT_MENU.CONTACT,
    href: ROUTES.SUPPORT_CONTACT,
  },
  {
    label: SUPPORT_MENU.BUG_REPORT,
    href: ROUTES.SUPPORT_BUG_REPORT,
  },
  {
    label: SUPPORT_MENU.REQUESTS,
    href: ROUTES.SUPPORT_REQUESTS,
  },
  {
    label: SUPPORT_MENU.NOTICES,
    href: ROUTES.SUPPORT_NOTICES,
  },
  {
    label: SUPPORT_MENU.FAQ,
    href: ROUTES.SUPPORT_FAQ,
  },
];
