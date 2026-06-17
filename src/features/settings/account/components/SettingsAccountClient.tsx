"use client";

import { useCurrentUserQuery } from "@/features/users/hooks/useCurrentUserQuery";
import UserProfile from "./UserProfile";
import { SettingsCard } from "../../components/SettingCard";

export function SettingsAccountClient() {
  const { data: user, isLoading } = useCurrentUserQuery();

  if (!user) return <div>로그인이 필요합니다.</div>;

  const accountCards = [
    {
      id: "profile",
      component: <UserProfile user={user} isLoading={isLoading} />,
    },
  ];

  return (
    <div className="mx-auto w-full space-y-6">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">계정 관리</h1>
        <p className="text-gray-500">
          사용자 프로필 및 계정 정보를 관리합니다.
        </p>
      </div>
      {accountCards.map((card) => (
        <SettingsCard key={card.id}>{card.component}</SettingsCard>
      ))}
    </div>
  );
}
