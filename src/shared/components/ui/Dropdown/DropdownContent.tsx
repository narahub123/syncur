"use client";

import { KeyboardEvent, ReactNode, useEffect, useRef } from "react";

import { useDropdown } from "./DropdownRoot";

type Props = {
  children: ReactNode;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DropdownContent = ({ children }: Props) => {
  const { open, close, focusTrigger, setFloatingRef, floatingStyles } =
    useDropdown();

  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const firstFocusable =
      contentRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);

    firstFocusable?.focus();
  }, [open]);

  if (!open) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      close();
      focusTrigger();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      contentRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ??
        [],
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  return (
    <>
      <button
        type="button"
        tabIndex={-1}
        aria-label="드롭다운 닫기"
        className="bg-overlay fixed inset-0 z-40"
        onClick={close}
      />

      <div
        ref={(node) => {
          contentRef.current = node;
          setFloatingRef(node);
        }}
        style={floatingStyles}
        role="menu"
        aria-label="드롭다운 메뉴"
        aria-modal="true"
        onKeyDown={handleKeyDown}
        className="border-border bg-card text-card-foreground z-50 min-w-30 rounded-md border shadow-lg"
      >
        {children}
      </div>
    </>
  );
};

export default DropdownContent;
