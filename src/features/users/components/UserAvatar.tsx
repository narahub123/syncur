import { useState } from "react";

import { NativeImageProps } from "@/shared/types/element-props";
import { cn } from "@/shared/utils/cn";

type UserAvatarProps = NativeImageProps;

const UserAvatar = ({
  src,
  alt,
  width = 48,
  height = 48,
  className,
  ...props
}: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        style={{ width, height }}
        className={cn(
          "bg-muted flex items-center justify-center rounded-full font-medium",
          className,
        )}
      >
        {alt?.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("rounded-full object-cover", className)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default UserAvatar;
