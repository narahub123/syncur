import { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

const ModalMain = ({ children, className }: Props) => {
  return (
    <main className={cn("text-foreground py-2 whitespace-pre-line", className)}>
      {children}
    </main>
  );
};

export default ModalMain;
