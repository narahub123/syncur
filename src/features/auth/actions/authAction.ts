"use server";

import { signIn, signOut } from "@/auth";

/**
 * Google OAuth 로그인을 시작한다.
 */
export async function signInWithGoogle() {
  await signIn("google");
}

/**
 * 현재 사용자를 로그아웃한다.
 */
export async function signOutUser() {
  await signOut();
}
