import { auth } from "@/auth";
import { AdminSidebarWrapper } from "@/features/admin/components/AdminSidebarWrapper";
import NotificationDeniedBanner from "@/features/notifications/components/NotificationDeniedBanner";
import NotificationPermissionBanner from "@/features/notifications/components/NotificationPermissionBanner";
import { USER_ROLE } from "@/features/users/constants/user-role";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { ROUTES } from "@/shared/constants/routes";
import AdminSSEProvider from "@/shared/providers/AdminSSEProvider";
import { redirect } from "next/navigation";

/**
 * Admin Layout
 *
 * admin 영역 전체를 감싸는 레이아웃
 *
 * 역할:
 * - /admin 하위 모든 페이지 접근 제어
 * - 공통 UI (Header 등) 제공
 * - 인증 및 권한 체크 수행
 *
 * 특징:
 * - page 단위가 아니라 "영역 단위" 보호
 * - admin route 전체를 한 번에 차단
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  /**
   * 로그인 여부 검증
   *
   * - session이 없거나
   * - user email이 없는 경우
   *
   * → 비로그인 사용자 접근 차단
   */
  if (!session?.user?.email) {
    redirect(`${ROUTES.HOME}?app-error=LoginRequired`);
  }

  /**
   * 관리자 권한 검증
   *
   * - 일반 사용자 접근 차단
   * - role이 ADMIN이 아닌 경우 홈으로 리다이렉트
   */
  if (session?.user.role !== USER_ROLE.ADMIN) {
    redirect(`${ROUTES.HOME}`);
  }

  /**
   * Admin UI 렌더링
   *
   * - AdminHeader: 관리자 공통 헤더
   * - children: 각 admin 페이지 콘텐츠
   */
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AdminSSEProvider />
        <AdminSidebarWrapper />
        <main className="flex-1">
          <header className="flex h-16 items-center border-b px-4">
            <SidebarTrigger /> {/* 사이드바 토글 버튼 */}
            <h1 className="ml-4 font-semibold">관리자 대시보드</h1>
          </header>
          <NotificationPermissionBanner />
          <NotificationDeniedBanner />
          <div className="flex flex-1 flex-col p-6">{children}</div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
