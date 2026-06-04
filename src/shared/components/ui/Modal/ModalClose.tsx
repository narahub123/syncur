"use client";

import { ButtonHTMLAttributes } from "react";
import { useModal } from "./ModalRoot";
import { cn } from "@/shared/utils/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const ModalClose = ({ className, children, title, ...props }: Props) => {
  const { onClose } = useModal();

  return (
    <button
      {...props}
      type="button"
      onClick={onClose}
      title={title ?? "닫기"}
      aria-label={title ?? "닫기"}
      className={cn(
        "focus-visible:ring-primary cursor-pointer rounded-md focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default ModalClose;
