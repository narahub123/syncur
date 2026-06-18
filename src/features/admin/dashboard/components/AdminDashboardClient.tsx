"use client";

import { SystemSection } from "./SystemSection";
import { UserSection } from "./UserSection";
import { CsSection } from "./CsSection";

export const AdminDashboardClient = () => {
  return (
    <div className="flex flex-1 flex-col gap-8 p-6">
      <SystemSection />

      <UserSection />

      <CsSection />
    </div>
  );
};
