import { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost"
  | "link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-blue-500 text-white hover:bg-blue-600",

  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",

  danger: "bg-red-500 text-white hover:bg-red-600",

  outline:
    "border border-gray-300 bg-transparent text-gray-900 hover:bg-muted/50",

  ghost: "bg-transparent text-gray-900 hover:bg-gray-100",

  link: "bg-transparent p-0 text-blue-500 underline-offset-4 hover:underline",
};

const Button = ({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "cursor-pointer rounded-lg px-3 py-2 transition-colors disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        variant === "link" && "rounded-none px-0 py-0",
        className,
      )}
    >
      {children}
    </button>
  );
};

export default Button;
