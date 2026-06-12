"use client";

import Link from "next/link";
import { ADMIN_NAV_LIST } from "../constants/admin-nav";
import { cn } from "@/shared/utils/cn";
import { usePathname } from "next/navigation";

const AdminNav = () => {
  const pathname = usePathname();

  return (
    <nav className="flex w-full items-center justify-around">
      {ADMIN_NAV_LIST.map((item) => {
        const { label, href } = item;
        return (
          <Link
            href={href}
            key={href}
            className={cn(
              "hover:bg-accent focus-visible:bg-accent flex-1 p-3 text-center",
              pathname === href ? "bg-accent" : "",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default AdminNav;
