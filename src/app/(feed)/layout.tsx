import LeftSidebar from "@/shared/components/layout/LeftSidebar";
import Main from "@/shared/components/layout/Main";
import RightSidebar from "@/shared/components/layout/RightSidebar";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full">
      <LeftSidebar />
      <Main>{children}</Main>
      <RightSidebar />
    </div>
  );
}
