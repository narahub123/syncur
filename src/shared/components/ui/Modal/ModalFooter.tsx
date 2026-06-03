import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ModalFooter = ({ className, children }: Props) => {
  return (
    <div className={cn("mt-6 flex justify-end gap-2", className)}>
      {children}
    </div>
  );
};

export default ModalFooter;
