"use client";

import { ButtonHTMLAttributes } from "react";
import { useDropdown } from "./DropdownRoot";
import { cn } from "@/shared/utils/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const DropdownItem = ({
  children,
  onClick,
  className: _className,
  ...props
}: Props) => {
  const { close } = useDropdown();

  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "text-card-foreground w-full cursor-pointer rounded-sm px-3 py-2 text-left text-sm",
        "hover:bg-muted focus-visible:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none",
        _className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
    >
      {children}
    </button>
  );
};

export default DropdownItem;
