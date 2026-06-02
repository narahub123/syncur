"use client";

import { ButtonHTMLAttributes } from "react";
import { useModal } from "./ModalRoot";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

const ModalClose = ({ children, title, ...props }: Props) => {
  const { onClose } = useModal();

  return (
    <button {...props} onClick={onClose} title={title ?? "닫기"}>
      {children}
    </button>
  );
};

export default ModalClose;
