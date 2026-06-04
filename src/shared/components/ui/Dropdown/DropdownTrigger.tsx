"use client";

import { ButtonHTMLAttributes } from "react";
import { useDropdown } from "./DropdownRoot";
import { cn } from "@/shared/utils/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const DropdownTrigger = ({ children, onClick, className, ...props }: Props) => {
  const { open, setReferenceRef, toggle } = useDropdown();

  return (
    <button
      ref={setReferenceRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      className={cn(
        "text-foreground cursor-pointer rounded-md px-3 py-2 text-sm",
        "hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none",
        className,
      )}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
    >
      {children}
    </button>
  );
};

export default DropdownTrigger;
