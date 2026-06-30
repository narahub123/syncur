import UserMenuDropdown from "@/features/users/components/UserMenuDropdown";
import { ThemeToggle } from "../common/ThemeToggle";
import Logo from "../common/Logo";
import SiteSubscriptionDialog from "../common/SiteSubscriptionDialog";
import AdminButton from "../common/AdminButton";
import { NotificationNavButton } from "@/features/notifications/components/NotificationNavButton";

const LeftSidebar = () => {
  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center border-l border-gray-100 xl:w-64">
      <Logo />
      <div className="flex w-full flex-col items-center gap-2">
        <SiteSubscriptionDialog />
        <ThemeToggle />
        <NotificationNavButton />
        <AdminButton />
      </div>

      <div className="mt-auto">
        <UserMenuDropdown />
      </div>
    </aside>
  );
};

export default LeftSidebar;
