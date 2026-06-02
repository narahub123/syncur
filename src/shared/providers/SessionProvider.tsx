"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

type SessionProviderProps = {
  children: React.ReactNode;
};

/**
 * 클라이언트 컴포넌트에서 NextAuth 세션을 사용할 수 있게 하는 Provider.
 *
 * 사용 예:
 * - useSession()
 * - signIn()
 * - signOut()
 */
export default function SessionProvider({ children }: SessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
