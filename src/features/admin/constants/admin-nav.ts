import { ROUTES } from "@/shared/constants/routes";

export const ADMIN_NAV_LIST = [
  { label: "처음으로", href: ROUTES.ADMIN_DASHBOARD },
  { label: "Users", href: ROUTES.ADMIN_USERS },
  { label: "Feeds", href: ROUTES.ADMIN_FEEDS },
  { label: "Logs", href: ROUTES.ADMIN_LOGS },
  { label: "알림", href: ROUTES.ADMIN_NOTIFICATIONS },
  { label: "공지", href: ROUTES.ADMIN_NOTICES },
  { label: "문의", href: ROUTES.ADMIN_INQUIRIES },
  { label: "버그", href: ROUTES.ADMIN_BUG_REPORTS },
  { label: "FAQs", href: ROUTES.ADMIN_FAQS },
];
