import { cn } from "@/shared/utils/cn";
import Image, { ImageProps } from "next/image";

type UserAvatarProps = ImageProps;

const UserAvatar = ({
  src,
  alt,
  width = 48,
  height = 48,
  className,
  ...props
}: UserAvatarProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("rounded-full object-cover", className)}
      {...props}
    />
  );
};

export default UserAvatar;
