import FeedTabs from "@/features/feeds/components/FeedTabs";
import NotificationDeniedBanner from "@/features/notifications/components/NotificationDeniedBanner";
import NotificationPermissionBanner from "@/features/notifications/components/NotificationPermissionBanner";
import LeftSidebar from "@/shared/components/layout/LeftSidebar";
import Main from "@/shared/components/layout/Main";
import RightSidebar from "@/shared/components/layout/RightSidebar";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import UserSSEProvider from "@/shared/providers/UserSSEProvider";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();

  return (
    <div className="flex min-h-screen w-full">
      <UserSSEProvider />;
      <LeftSidebar />
      <Main>
        <FeedTabs />
        <NotificationPermissionBanner />
        <NotificationDeniedBanner />
        {children}
      </Main>
      <RightSidebar />
    </div>
  );
}
