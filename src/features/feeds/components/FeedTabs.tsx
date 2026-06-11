"use client";

import { cn } from "@/shared/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FEED_TABS } from "../constants/feedTab";

const FeedTabs = () => {
  const pathname = usePathname();

  return (
    <nav className="flex border-b border-gray-100">
      {FEED_TABS.map((tab) => (
        <Link
          href={tab.link}
          key={tab.link}
          className={cn(
            "hover:bg-accent flex flex-1 items-center justify-center border-r border-gray-100 p-2 last:border-r-0",
            pathname === tab.link ? "bg-accent" : "",
          )}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
};

export default FeedTabs;
