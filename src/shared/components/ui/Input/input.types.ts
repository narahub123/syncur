import { NativeInputProps } from "@/shared/types/element-props";
import React from "react";

export type InputSize = "sm" | "md" | "lg";

export type InputProps = Omit<
  NativeInputProps,
  "onChange" | "onFocus" | "onBlur"
> & {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;

  type?: "text" | "password" | "email" | "number";
  placeholder?: string;

  disabled?: boolean;
  readOnly?: boolean;

  error?: boolean;
  helperText?: string;

  label?: string;
  required?: boolean;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  size?: InputSize;
  fullWidth?: boolean;

  className?: string;
  inputClassName?: string;
  wrapperClassName?: string;

  onFocus?: () => void;
  onBlur?: () => void;
};
