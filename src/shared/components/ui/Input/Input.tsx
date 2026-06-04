"use client";

import { forwardRef } from "react";
import { InputProps } from "./input.types";
import { InputField } from "./InputField";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <InputField {...props} inputRef={ref} />;
});

Input.displayName = "Input";
