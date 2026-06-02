import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const ModalHeader = ({ children }: Props) => {
  return <div className="mb-4">{children}</div>;
};

export default ModalHeader;
