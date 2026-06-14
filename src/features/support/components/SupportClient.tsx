"use client";

import { SUPPORT_NAV_ITEMS } from "../constants/support-menu";
import SupportMenuItem from "./SupportMenuItem";

const SupportClient = () => {
  return (
    <nav>
      {SUPPORT_NAV_ITEMS.map((item) => (
        <SupportMenuItem key={item.href} label={item.label} href={item.href} />
      ))}
    </nav>
  );
};

export default SupportClient;
