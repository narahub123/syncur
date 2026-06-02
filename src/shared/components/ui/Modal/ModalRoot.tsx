"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";

type ModalContextType = {
  open: boolean;
  onClose: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error("Modal 컴포넌트 내부에서 사용해주세요.");
  }

  return context;
};

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const ModalRoot = ({ open, onClose, children }: Props) => {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ModalContext.Provider
      value={{
        open,
        onClose,
      }}
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {children}
      </div>
    </ModalContext.Provider>
  );
};

export default ModalRoot;
