"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  AlertTriangle,
  Database,
  MessageCircle,
  Users,
  Activity,
  Rss,
} from "lucide-react";
import { SystemSection } from "./SystemSection";
import { UserSection } from "./UserSection";
import { CsSection } from "./CsSection";

// 시스템 관제 데이터 (피드 중심)
const SYSTEM_STATS = [
  { title: "전체 피드", value: "128", icon: Rss, desc: "구독 중인 RSS 개수" },
  {
    title: "오류 발생 피드",
    value: "3",
    icon: AlertTriangle,
    desc: "수집 실패한 피드",
    className: "text-red-500",
  },
  {
    title: "오늘 수집된 기사",
    value: "2,450",
    icon: Database,
    desc: "총 수집된 FeedItem 수",
  },
  {
    title: "시스템 상태",
    value: "정상",
    icon: Activity,
    desc: "수집 서버 가동 중",
  },
];

// 고객 운영 데이터
const CUSTOMER_STATS = [
  { title: "신규 가입자", value: "24", icon: Users, desc: "지난 24시간 기준" },
  {
    title: "대기 중 문의",
    value: "5",
    icon: MessageCircle,
    desc: "답변이 필요한 문의",
  },
];

export const AdminDashboardClient = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      {/* 1. 시스템 관제 영역 (Feed/FeedItem 중심) */}
      <SystemSection />

      <UserSection />

      <CsSection />
    </div>
  );
};
