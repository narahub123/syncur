import FeedTabs from "@/features/feeds/components/FeedTabs";
import LeftSidebar from "@/shared/components/layout/LeftSidebar";
import Main from "@/shared/components/layout/Main";
import RightSidebar from "@/shared/components/layout/RightSidebar";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  return (
    <div className="flex min-h-screen w-full">
      <LeftSidebar />
      <Main>
        <FeedTabs />
        {children}
      </Main>
      <RightSidebar />
    </div>
  );
}
