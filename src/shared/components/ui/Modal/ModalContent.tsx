"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useModal } from "./ModalRoot";

type Props = {
  children: ReactNode;
};

const FOCUSABLE_SELECTOR = `
  button:not([disabled]),
  input:not([disabled]),
  textarea:not([disabled]),
  select:not([disabled]),
  a[href],
  [tabindex]:not([tabindex="-1"])
`;

const ModalContent = ({ children }: Props) => {
  const { onClose } = useModal();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    const focusableElements =
      dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    firstElement?.focus() ?? dialog.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
      >
        {children}
      </div>
    </>
  );
};

export default ModalContent;
