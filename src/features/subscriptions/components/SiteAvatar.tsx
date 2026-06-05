"use client";

import { SiteSearchDto } from "@/features/rss/site/dto/search-site";
import Image from "next/image";

type SiteAvatarProps = {
  site: SiteSearchDto;
};

const SiteAvatar = ({ site }: SiteAvatarProps) => {
  return (
    <figure
      className="flex size-5 items-center justify-center rounded-full border border-gray-200 bg-blue-400 text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {site.favicon_url ? (
        <Image
          src={site.favicon_url}
          alt={site.name}
          width={10}
          height={10}
          className="size-5 rounded-full object-cover"
        />
      ) : (
        site.name.charAt(0)
      )}
    </figure>
  );
};

export default SiteAvatar;
