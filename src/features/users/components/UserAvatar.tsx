import { useState } from "react";
import { NativeImageProps } from "@/shared/types/element-props";
import { cn } from "@/shared/utils/cn";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

interface UserAvatarProps extends Omit<NativeImageProps, "src"> {
  src?: string | null; // 💡 기존의 문자열 URL 지원
  profileImage?: ImageInfo | null; // 💡 서비스 전용 객체 지원
  name?: string | null;
}

const UserAvatar = ({
  src,
  profileImage,
  name,
  width = 48,
  height = 48,
  className,
  ...props
}: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);
  const finalSrc = profileImage?.url || src;

  // 💡 핵심: className에 w/h가 있으면 width/height props를 무시하도록 처리
  const sizeStyle = className?.includes("w-") ? {} : { width, height };

  if (!finalSrc || hasError) {
    return (
      <div
        style={sizeStyle}
        className={cn(
          "bg-muted text-muted-foreground flex items-center justify-center rounded-full font-medium",
          className, // 여기에 "h-20 w-20"이 들어오면 기존 width/height 스타일을 덮어씁니다.
        )}
      >
        {name?.charAt(0).toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={name || "사용자 프로필"}
      style={sizeStyle}
      className={cn("rounded-full object-cover", className)}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default UserAvatar;
