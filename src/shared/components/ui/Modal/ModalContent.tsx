"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useModal } from "./ModalRoot";
import { cn } from "@/shared/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

const FOCUSABLE_SELECTOR = `
  button:not([disabled]),
  input:not([disabled]),
  textarea:not([disabled]),
  select:not([disabled]),
  a[href],
  [tabindex]:not([tabindex="-1"])
`;

const ModalContent = ({ className, children }: Props) => {
  const { onClose } = useModal();
  const dialogRef = useRef<HTMLDivElement>(null);

  /**
   * 모달 접근성을 위한 포커스 트랩을 설정한다.
   *
   * 역할:
   * - 모달이 열리면 첫 번째 포커스 가능한 요소에 포커스를 이동한다.
   * - 포커스 가능한 요소가 없으면 모달 컨테이너에 포커스를 이동한다.
   * - Tab / Shift + Tab 이동 시 포커스가 모달 밖으로 빠져나가지 않도록 순환시킨다.
   */
  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    /**
     * 현재 모달 내부의 포커스 가능한 요소를 조회한다.
     *
     * disabled 상태 변경 등으로 요소 목록이 동적으로 변할 수 있으므로
     * 필요한 시점마다 새로 조회한다.
     */
    const getFocusableElements = () =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));

    /**
     * 모달 렌더링이 완료된 이후 초기 포커스를 설정한다.
     */
    const frameId = requestAnimationFrame(() => {
      const firstElement = getFocusableElements()[0];

      if (firstElement) {
        firstElement.focus();
        return;
      }

      dialog.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      /**
       * 포커스 가능한 요소가 없으면
       * 모달 컨테이너에 포커스를 유지한다.
       */
      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      /**
       * Shift + Tab으로 첫 번째 요소에서 이전으로 이동하려는 경우
       * 마지막 요소로 순환시킨다.
       */
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      /**
       * Tab으로 마지막 요소에서 다음으로 이동하려는 경우
       * 첫 번째 요소로 순환시킨다.
       */
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(frameId);
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
        className={cn(
          "relative z-10 w-full max-w-xl rounded-lg bg-white p-6 shadow-lg",
          className,
        )}
      >
        {children}
      </div>
    </>
  );
};

export default ModalContent;
