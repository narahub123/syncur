import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";
import { useModal } from "./ModalRoot";

type Props = {
  children: ReactNode;
  className?: string;
};

const ModalDescription = ({ className, children }: Props) => {
  const { descriptionId } = useModal();
  return (
    <p
      className={cn(
        "text-muted-foreground mt-2 text-sm whitespace-pre-line",
        className,
      )}
      id={descriptionId}
    >
      {children}
    </p>
  );
};

export default ModalDescription;
