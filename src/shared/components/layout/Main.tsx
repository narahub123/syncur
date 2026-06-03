import { cn } from "@/shared/utils/cn";
import { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
  className?: string;
};

const Main = ({ className, children }: MainProps) => {
  return (
    <main className={cn("min-w-0 flex-1 border-x border-gray-100", className)}>
      {children}
    </main>
  );
};

export default Main;
