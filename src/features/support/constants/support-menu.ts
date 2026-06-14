import { ROUTES } from "@/shared/constants/routes";

export const SUPPORT_MENU = {
  INQUIRIES: "문의하기",
  BUG_REPORTS: "오류 신고",
  REQUESTS: "내 문의",
  NOTICES: "공지사항",
  FAQS: "FAQ",
} as const;

export type SupportNavItem = {
  label: string;
  href: string;
};

export const SUPPORT_NAV_ITEMS: SupportNavItem[] = [
  {
    label: SUPPORT_MENU.INQUIRIES,
    href: ROUTES.SUPPORT_INQUIRIES,
  },
  {
    label: SUPPORT_MENU.BUG_REPORTS,
    href: ROUTES.SUPPORT_BUG_REPORTS,
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
    label: SUPPORT_MENU.FAQS,
    href: ROUTES.SUPPORT_FAQS,
  },
];
