"use client";

import { InputProps } from "./input.types";
import { cn } from "@/shared/utils/cn";

type Props = InputProps & {
  /**
   * value 변경을 string 단위로 추상화한 handler
   * (native event 대신 design system 레벨 API)
   */
  onValueChange?: (value: string) => void;
};

export const InputBase = ({
  type = "text",
  value,
  defaultValue,
  placeholder,
  disabled,
  readOnly,
  size = "md",
  inputClassName,
  onValueChange,
  onFocus,
  onBlur,
}: Props) => {
  return (
    <input
      type={type}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(e) => onValueChange?.(e.target.value)}
      className={cn("input", inputClassName, `input--${size}`)}
    />
  );
};
