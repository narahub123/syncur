import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/shared/utils/cn";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";

// ImageInfo와 문자열 URL을 모두 허용하는 타입
type AvatarSrc = string | ImageInfo | null | undefined;

// 필요한 HTML 이미지 속성들을 명시적으로 정의합니다.
interface AvatarProps extends React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> {
  src?: AvatarSrc | AvatarSrc[];
  name?: string | null;
  variant?: "user" | "site";
  size?: "sm" | "md" | "lg";
  // HTML img 표준 속성 중 필요한 것들을 여기에 정의하여 전달받습니다.
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(
  (
    { className, src, name, variant = "user", size = "md", imgProps, ...props },
    ref,
  ) => {
    // 1. URL 추출 유틸: ImageInfo 객체 혹은 문자열 처리
    const getUrl = (s: AvatarSrc): string | null => {
      if (!s) return null;
      return typeof s === "object" ? (s as ImageInfo).url : s;
    };

    const sources = Array.isArray(src) ? src : [src];
    const finalSrc = sources.map(getUrl).find((u) => u !== null) || null;

    const sizeClasses = {
      sm: "h-9 w-9 text-sm",
      md: "h-12 w-12 text-base",
      lg: "h-20 w-20 text-2xl",
    };

    const variantClasses = {
      user: "rounded-full",
      site: "rounded-md bg-white shadow-sm border border-gray-100",
    };

    return (
      <AvatarPrimitive.Root
        ref={ref}
        aria-label={name || "아바타"}
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden bg-white font-medium",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        <AvatarPrimitive.Image
          className={cn(
            "aspect-square h-full w-full object-cover",
            imgProps?.className,
          )}
          src={finalSrc || undefined}
          alt={imgProps?.alt || name || "avatar"} // name을 기본값으로 사용
          {...imgProps}
        />
        <AvatarPrimitive.Fallback className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
          {name?.charAt(0).toUpperCase() || "?"}
        </AvatarPrimitive.Fallback>
      </AvatarPrimitive.Root>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar };
