import LogoutButton from "@/features/auth/components/LogoutButton";

const LeftSidebar = () => {
  return (
    <aside className="w-16 shrink-0 xl:w-64">
      <p>왼쪽 사이드바</p>
      <LogoutButton />
    </aside>
  );
};

export default LeftSidebar;
