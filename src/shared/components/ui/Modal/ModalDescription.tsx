import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const ModalDescription = ({ className: _className, children }: Props) => {
  const className = cn("mt-2 text-gray-600 whitespace-pre-line", _className);
  return <p className={className}>{children}</p>;
};

export default ModalDescription;
