import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ModalFooter = ({ className: _className, children }: Props) => {
  const className = cn("mt-6 flex justify-end gap-2", _className);

  return <div className={className}>{children}</div>;
};

export default ModalFooter;
