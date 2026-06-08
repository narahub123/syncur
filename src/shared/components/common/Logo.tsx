"use client";

import { ROUTES } from "@/shared/constants/routes";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={ROUTES.HOME} className="flex h-16 items-center justify-center">
      <span className="flex size-12 items-center justify-center rounded-full border border-gray-200 text-xl font-black xl:hidden">
        S
      </span>

      <span className="hidden text-xl font-black tracking-tight xl:block">
        Syncur
      </span>
    </Link>
  );
};

export default Logo;
