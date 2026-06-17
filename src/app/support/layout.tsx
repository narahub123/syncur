import SupportBackButton from "@/features/support/components/SupportBackButton";
import LeftSidebar from "@/shared/components/layout/LeftSidebar";
import Main from "@/shared/components/layout/Main";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import UserSSEProvider from "@/shared/providers/UserSSEProvider";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl xl:max-w-6xl">
      <div className="flex h-screen w-full">
        <UserSSEProvider />
        <LeftSidebar />
        <Main className="flex min-h-0 flex-1 flex-col">
          <SupportBackButton />
          {children}
        </Main>
      </div>
    </div>
  );
}
