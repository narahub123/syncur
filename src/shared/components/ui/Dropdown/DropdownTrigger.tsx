"use client";

import { ButtonHTMLAttributes } from "react";

import { useDropdown } from "./DropdownRoot";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const DropdownTrigger = ({ children, onClick, ...props }: Props) => {
  const { open, setReferenceRef, toggle } = useDropdown();

  return (
    <button
      ref={setReferenceRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
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
