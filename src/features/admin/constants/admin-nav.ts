import { ROUTES } from "@/shared/constants/routes";

import {
  LayoutDashboard,
  Users,
  Rss,
  FileText,
  Bell,
  Megaphone,
  MessageCircle,
  Bug,
  HelpCircle,
  Home,
  Globe,
} from "lucide-react";

// constants/admin-nav.ts
export const ADMIN_NAV_LIST = [
  { label: "홈", href: ROUTES.HOME, icon: Home, tooltip: "메인 페이지로 이동" },
  {
    label: "대시보드",
    href: ROUTES.ADMIN_DASHBOARD,
    icon: LayoutDashboard,
    tooltip: "대시보드로 이동",
  },
  {
    label: "사용자 관리",
    href: ROUTES.ADMIN_USERS,
    icon: Users,
    tooltip: "사용자 목록 및 관리",
  },
  {
    label: "사이트 관리",
    href: ROUTES.ADMIN_SITES, // ROUTES 설정에 맞게 수정
    icon: Globe,
    tooltip: "수집 사이트 목록 및 설정",
  },
  {
    label: "피드 관리",
    href: ROUTES.ADMIN_FEEDS,
    icon: Rss,
    tooltip: "피드 및 콘텐츠 관리",
  },
  {
    label: "로그 관리",
    href: ROUTES.ADMIN_LOGS,
    icon: FileText,
    tooltip: "시스템 로그 확인",
  },
  {
    label: "알림 관리",
    href: ROUTES.ADMIN_NOTIFICATIONS,
    icon: Bell,
    tooltip: "푸시 및 시스템 알림",
  },
  {
    label: "공지사항",
    href: ROUTES.ADMIN_NOTICES,
    icon: Megaphone,
    tooltip: "공지사항 작성 및 수정",
  },
  {
    label: "1:1 문의",
    href: ROUTES.ADMIN_INQUIRIES,
    icon: MessageCircle,
    tooltip: "문의 내역 확인",
  },
  {
    label: "버그 제보",
    href: ROUTES.ADMIN_BUG_REPORTS,
    icon: Bug,
    tooltip: "사용자 버그 제보 확인",
  },
  {
    label: "자주 묻는 질문",
    href: ROUTES.ADMIN_FAQS,
    icon: HelpCircle,
    tooltip: "FAQ 관리",
  },
];
