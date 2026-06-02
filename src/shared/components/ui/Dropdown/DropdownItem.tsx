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

  const className = cn(
    "w-full rounded-sm px-3 py-2 text-left text-sm hover:bg-gray-100 cursor-pointer",
    _className,
  );

  return (
    <button
      type="button"
      role="menuitem"
      className={className}
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
