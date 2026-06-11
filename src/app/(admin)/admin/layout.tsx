import { auth } from "@/auth";
import AdminHeader from "@/features/admin/components/AdminHeader";
import { USER_ROLE } from "@/features/users/constants/user-role";
import { ROUTES } from "@/shared/constants/routes";
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
    <div className="mt-1 flex flex-1 flex-col border-x border-gray-100">
      <AdminHeader />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
