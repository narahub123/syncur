"use client";

import { SystemSection } from "./SystemSection";
import { UserSection } from "./UserSection";
import { CsSection } from "./CsSection";
import { useDashboardStatsQuery } from "../hooks/useDashboardStatsQuery";

export const AdminDashboardClient = () => {
  const { data, isLoading, isError, refetch } = useDashboardStatsQuery();

  if (!data) return null;

  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <SystemSection system={data.system} />

      <UserSection />

      <CsSection />
    </div>
  );
};
