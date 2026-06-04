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
  primary:
    "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active focus-visible:ring-primary",

  secondary:
    "bg-muted text-foreground hover:bg-muted/80 focus-visible:[--ring:var(--color-muted-foreground)]",

  danger:
    "bg-red-400 text-white hover:bg-red-600 focus-visible:[--ring:#ef4444]",

  outline:
    "border border-border bg-transparent text-foreground hover:bg-muted/50 focus-visible:ring-primary",

  ghost:
    "bg-transparent text-foreground hover:bg-muted focus-visible:ring-muted-foreground",

  link: "text-primary underline-offset-4 hover:underline focus-visible:ring-primary",
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
        "cursor-pointer rounded-lg px-3 py-2 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
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
