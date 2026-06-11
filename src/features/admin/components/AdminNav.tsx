import Link from "next/link";
import { ADMIN_NAV_LIST } from "../constants/admin-nav";

const AdminNav = () => {
  return (
    <nav className="flex w-full items-center justify-around">
      {ADMIN_NAV_LIST.map((item) => {
        const { label, href } = item;
        return (
          <Link
            href={href}
            key={href}
            className="hover:bg-accent focus-visible:bg-accent flex-1 p-3 text-center"
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNav;
