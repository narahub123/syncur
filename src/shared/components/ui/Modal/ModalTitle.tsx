import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ModalTitle = ({ className: _className, children }: Props) => {
  const className = cn("text-lg font-bold", _className);
  return <h2 className={className}>{children}</h2>;
};

export default ModalTitle;
