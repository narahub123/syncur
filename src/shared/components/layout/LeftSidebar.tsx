import LogoutButton from "@/features/auth/components/LogoutButton";
import UserMenu from "@/features/users/components/UserMenu";

const LeftSidebar = () => {
  return (
    <aside className="flex h-full w-16 shrink-0 flex-col xl:w-64">
      <p>왼쪽 사이드바</p>
      <LogoutButton />
      <div className="mt-auto">
        <UserMenu />
      </div>
    </aside>
  );
};

export default LeftSidebar;
