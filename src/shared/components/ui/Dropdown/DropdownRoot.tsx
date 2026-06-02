"use client";

import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
  type Placement,
  type UseFloatingReturn,
} from "@floating-ui/react";
import { createContext, ReactNode, useContext, useState } from "react";

type DropdownContextType = {
  /**
   * 드롭다운 열림 여부.
   */
  open: boolean;

  /**
   * Floating UI 기준 요소(Trigger)와
   * 플로팅 요소(Content)의 ref.
   */
  setReferenceRef: (node: HTMLButtonElement | null) => void;
  setFloatingRef: (node: HTMLDivElement | null) => void;
  focusTrigger: () => void;

  /**
   * Floating UI가 계산한 위치 스타일.
   */
  floatingStyles: UseFloatingReturn["floatingStyles"];

  /**
   * 드롭다운 열림/닫힘 토글.
   */
  toggle: () => void;

  /**
   * 드롭다운 닫기.
   */
  close: () => void;
};

const DropdownContext = createContext<DropdownContextType | null>(null);

/**
 * Dropdown Context를 조회한다.
 */
export const useDropdown = () => {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown 컴포넌트 내부에서 사용해주세요.");
  }

  return context;
};

type Props = {
  children: ReactNode;

  /**
   * 드롭다운 기본 배치 위치.
   *
   * 예:
   * - bottom-end
   * - bottom-start
   * - top-end
   * - right-start
   */
  placement?: Placement;

  /**
   * Trigger와 Dropdown 사이 간격(px).
   */
  offsetValue?: number;
};

const DropdownRoot = ({
  children,
  placement = "bottom-end",
  offsetValue = 8,
}: Props) => {
  const [open, setOpen] = useState(false);

  /**
   * Floating UI 위치 계산.
   *
   * 적용 기능:
   * - offset: Trigger와 간격 유지
   * - flip: 공간 부족 시 자동 반전
   * - shift: 화면 밖으로 벗어나지 않도록 보정
   * - autoUpdate: 스크롤/리사이즈 시 위치 재계산
   */
  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(offsetValue), flip(), shift({ padding: 8 })],
  });

  const setReferenceRef = (node: HTMLElement | null) => {
    refs.setReference(node);
  };

  const setFloatingRef = (node: HTMLElement | null) => {
    refs.setFloating(node);
  };

  const focusTrigger = () => {
    if (refs.reference.current instanceof HTMLElement) {
      refs.reference.current.focus();
    }
  };

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <DropdownContext.Provider
      value={{
        open,
        setReferenceRef,
        setFloatingRef,
        focusTrigger,
        floatingStyles,
        toggle,
        close,
      }}
    >
      <div className="inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

export default DropdownRoot;
