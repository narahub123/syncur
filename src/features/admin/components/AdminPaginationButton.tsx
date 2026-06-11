import { cn } from "@/shared/utils/cn";

type Props = {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  ariaLabel?: string;
  title?: string;
};

export default function AdminPaginationButton({
  active,
  disabled,
  onClick,
  children,
  ariaLabel,
  title,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded border px-3 py-1 transition-colors",
        `${
          active
            ? "cursor-default border-black bg-black text-white"
            : "bg-white hover:bg-gray-100"
        }`,
        "disabled:bg-white disabled:opacity-100 disabled:hover:bg-white",
      )}
      title={title}
    >
      {children}
    </button>
  );
}
