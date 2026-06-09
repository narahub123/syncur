"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import SiteAvatar from "@/features/rss/site/components/SiteAvatar";

export type SiteLinkCardDto = {
  favicon_url: string | null;
  name: string;
  url: string;
};

type Props = {
  site: SiteLinkCardDto;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

const SiteLinkCard = ({ site, onClick }: Props) => {
  const { favicon_url, name, url } = site;

  return (
    <Link
      href={url}
      target="_blank"
      title={`${name}로 이동하기`}
      onClick={onClick}
      className="hover:bg-accent focus-visible:bg-accent flex items-center gap-2 rounded-md px-2 py-1"
    >
      <SiteAvatar favicon_url={favicon_url} name={name} />

      <span className="truncate text-sm font-medium">{name}</span>
    </Link>
  );
};

export default SiteLinkCard;
