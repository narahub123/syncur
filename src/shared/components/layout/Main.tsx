import { ReactNode } from "react";

type MainProps = {
  children: ReactNode;
};

const Main = ({ children }: MainProps) => {
  return (
    <main className="min-w-0 flex-1 border-x border-gray-100">{children}</main>
  );
};

export default Main;
