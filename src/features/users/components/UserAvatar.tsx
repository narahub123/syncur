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
  return (
    <img
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
