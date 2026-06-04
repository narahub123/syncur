import { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import { useModal } from "./ModalRoot";

type Props = {
  children: ReactNode;

  className?: string;
};

const ModalHeader = ({ children, className }: Props) => {
  const { titleId } = useModal();
  return (
    <header id={titleId} className={cn("mb-4 space-y-1", className)}>
      {children}
    </header>
  );
};

export default ModalHeader;
