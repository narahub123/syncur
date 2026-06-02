import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ROUTES } from "@/shared/constants/routes";

/**
 * 비로그인 사용자만 접근할 수 있도록 보장한다.
 *
 * 로그인한 사용자가 접근하면
 * 피드 페이지로 이동시킨다.
 */
export async function requireGuest() {
  const session = await auth();

  if (session?.user?.email) {
    redirect(ROUTES.FEED);
  }

  return session;
}
