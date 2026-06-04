
import LeftSidebar from "@/shared/components/layout/LeftSidebar";
import Main from "@/shared/components/layout/Main";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  return (
    <div className="flex h-screen w-full">
      <LeftSidebar />
      <Main className="flex min-h-0 flex-1 flex-col">{children}</Main>
    </div>
  );
}
