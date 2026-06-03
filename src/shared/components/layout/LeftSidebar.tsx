import UserMenuDropdown from "@/features/users/components/UserMenuDropdown";
import { ThemeToggle } from "../common/ThemeToggle";

const LeftSidebar = () => {
  return (
    <aside className="flex h-full w-16 shrink-0 flex-col items-center border-l border-gray-100 xl:w-64">
      <p>왼쪽 사이드바</p>
      <ThemeToggle />
      <div className="mt-auto">
        <UserMenuDropdown />
      </div>
    </aside>
  );
};

export default LeftSidebar;
