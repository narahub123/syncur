"use client";

import { useSession } from "next-auth/react";

import UserAvatar from "./UserAvatar";

const UserMenu = () => {
  const { data, status } = useSession();

  if (status === "loading") {
    return (
      <div className="mx-2 flex items-center gap-2">
        <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />

        <div className="hidden flex-1 xl:block">
          <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="m-2 flex cursor-pointer items-center gap-2">
      {data?.user?.image && (
        <UserAvatar
          src={data.user.image}
          profileImage={data.user.profileImage}
          alt={
            data.user.name ? `${data.user.name}의 프로필 사진` : "프로필 사진"
          }
        />
      )}

      <div className="hidden min-w-0 flex-1 xl:block">
        <p className="truncate text-left font-medium">{data?.user?.name}</p>

        <p className="truncate text-left text-gray-400">{data?.user?.email}</p>
      </div>
    </div>
  );
};

export default UserMenu;
