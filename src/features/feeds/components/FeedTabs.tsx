"use client";

import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/utils/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FeedTabs = () => {
  const pathname = usePathname();

  const feedTabs = [
    { name: "피드", link: ROUTES.FEED },
    { name: "추천", link: ROUTES.RECOMMENDATION },
    { name: "인기", link: ROUTES.POPULAR },
  ];
  return (
    <nav className="flex border-b border-gray-100">
      {feedTabs.map((tab) => (
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
