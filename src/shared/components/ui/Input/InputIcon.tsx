"use client";

import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type InputIconProps = {
  children: ReactNode;

  position?: "left" | "right";

  variant?: "default" | "muted" | "interactive";

  size?: "sm" | "md";

  className?: string;

  /**
   * accessibility label (interactive일 때 필수)
   */
  "aria-label"?: string;

  onClick?: () => void;
};

export const InputIcon = ({
  children,
  position = "left",
  variant = "default",
  size = "md",
  className,
  onClick,
  ...ariaProps
}: InputIconProps) => {
  const isInteractive = variant === "interactive";

  return (
    <div
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-label={isInteractive ? ariaProps["aria-label"] : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                onClick?.();
              }
            }
          : undefined
      }
      aria-hidden={!isInteractive}
      className={cn(
        "input-icon",

        position === "left" && "left",
        position === "right" && "right",

        variant === "muted" && "input-icon--muted",
        variant === "interactive" && "input-icon--interactive",

        size === "sm" && "input-icon--sm",
        size === "md" && "input-icon--md",

        className,
      )}
    >
      {children}
    </div>
  );
};
