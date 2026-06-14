import { ChevronRight } from "lucide-react";
import Link from "next/link";

type Props = {
  label: string;
  href: string;
};

const SupportMenuItem = ({ label, href }: Props) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between border-b border-gray-100 px-3 py-6 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-blue-500"
    >
      <span>{label}</span>
      <ChevronRight aria-hidden="true" />
    </Link>
  );
};

export default SupportMenuItem;
