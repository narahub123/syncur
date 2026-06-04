"use client";

import { InputProps } from "./input.types";
import { INPUT_SIZE_MAP } from "./input.constants";

type Props = InputProps & {
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
  const sizeStyle = INPUT_SIZE_MAP[size];

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
      className={inputClassName}
      style={{
        height: sizeStyle.height,
        fontSize: sizeStyle.fontSize,
        paddingLeft: sizeStyle.paddingX,
        paddingRight: sizeStyle.paddingX,
        background: "var(--input-bg)",
        color: "var(--input-text)",
        border: "1px solid var(--input-border)",
        borderRadius: "8px",
        outline: "none",
        width: "100%",
        transition: "all 150ms ease",
      }}
    />
  );
};
