import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ROUTES } from "@/shared/constants/routes";

/**
 * 로그인한 사용자 정보를 반환한다.
 *
 * 비로그인 사용자가 접근하면
 * Home 페이지("/")로 이동시킨다.
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`${ROUTES.HOME}?app-error=LoginRequired`);
  }

  return session;
}
