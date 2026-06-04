"use client";

import { InputProps } from "./input.types";
import { InputField } from "./InputField";

export const Input = (props: InputProps) => {
  return <InputField {...props} />;
};
