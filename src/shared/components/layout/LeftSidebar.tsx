import UserMenuDropdown from "@/features/users/components/UserMenuDropdown";

const LeftSidebar = () => {
  return (
    <aside className="flex h-full w-16 shrink-0 flex-col xl:w-64">
      <p>왼쪽 사이드바</p>
      <div className="mt-auto">
        <UserMenuDropdown />
      </div>
    </aside>
  );
};

export default LeftSidebar;
