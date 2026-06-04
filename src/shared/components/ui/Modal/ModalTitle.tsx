import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ModalTitle = ({ className, children }: Props) => {
  return (
    <h2 className={cn("text-card-foreground text-lg font-semibold", className)}>
      {children}
    </h2>
  );
};

export default ModalTitle;
