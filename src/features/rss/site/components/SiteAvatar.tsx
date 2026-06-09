"use client";

import { useState } from "react";

type SiteAvatarProps = {
  favicon_url: string | null;
  name: string;
};

const SiteAvatar = ({ favicon_url, name }: SiteAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const showFallback = !favicon_url || imageError;

  return (
    <figure
      className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 text-sm font-semibold text-white"
      // bg-blue-400
      aria-hidden="true"
    >
      {showFallback ? (
        name.charAt(0).toUpperCase()
      ) : (
        <img
          src={favicon_url}
          alt=""
          className="h-8 w-8 object-cover"
          onError={() => setImageError(true)}
        />
      )}
    </figure>
  );
};

export default SiteAvatar;
