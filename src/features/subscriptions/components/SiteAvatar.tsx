"use client";

type SiteAvatarProps = {
  site: {
    favicon_url: string;
    name: string;
  };
};

const SiteAvatar = ({ site }: SiteAvatarProps) => {
  return (
    <figure
      className="flex size-4 items-center justify-center rounded-full border border-gray-200 bg-blue-400 text-sm font-semibold text-white"
      aria-hidden="true"
    >
      {site.favicon_url ? (
        <img
          src={site.favicon_url}
          alt={site.name}
          width={8}
          height={8}
          className="size-4 rounded-full object-cover"
        />
      ) : (
        site.name.charAt(0)
      )}
    </figure>
  );
};

export default SiteAvatar;
