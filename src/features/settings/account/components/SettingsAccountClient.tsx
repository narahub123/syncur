"use client";

import { useCurrentUserQuery } from "@/features/users/hooks/useCurrentUserQuery";
import UserProfileSection from "./UserProfileSection";

export function SettingsAccountClient() {
  const { data: user, isLoading } = useCurrentUserQuery();

  if (isLoading) return <div>로딩 중...</div>;
  if (!user) return <div>로그인이 필요합니다.</div>;

  return (
    <div className="mx-auto w-full space-y-8">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">계정 관리</h1>
        <p className="text-gray-500">
          사용자 프로필 및 계정 정보를 관리합니다.
        </p>
      </div>
      <UserProfileSection user={user} />
    </div>
  );
}
