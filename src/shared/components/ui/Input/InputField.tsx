"use client";

import { InputProps } from "./input.types";
import { InputBase } from "./InputBase";
import { InputLabel } from "./InputLabel";
import { InputHelperText } from "./InputHelperText";
import { cn } from "@/shared/utils/cn";
import { useState } from "react";

type Props = InputProps & {
  onValueChange?: (value: string) => void;
};

export const InputField = ({
  label,
  required,
  helperText,
  error,
  leftIcon,
  rightIcon,
  inputClassName,
  wrapperClassName,
  onValueChange,
  ...rest
}: Props) => {
  /**
   * focus state (interaction state)
   */
  const [isFocused, setIsFocused] = useState(false);

  /**
   * filled state (controlled/uncontrolled safe)
   * - value or defaultValue 기반으로 판단
   */
  const isFilled = Boolean(rest.value ?? rest.defaultValue);

  /**
   * state model (single source of truth for UI classes)
   */
  const state = {
    isDisabled: !!rest.disabled,
    isError: !!error,
    isReadOnly: !!rest.readOnly,
    isFilled,
    isFocused,
  };

  return (
    <div
      className={cn(
        "input-wrapper",
        wrapperClassName,
        rest.fullWidth && "w-full",
      )}
    >
      {/* =========================
       * Label
       * ========================= */}
      <InputLabel label={label} required={required} />

      {/* =========================
       * Input Container
       * ========================= */}
      <div className="input-container">
        {leftIcon && <div className="input-icon left">{leftIcon}</div>}

        <InputBase
          {...rest}
          onValueChange={onValueChange}
          /**
           * focus safety
           * - disabled 상태에서는 focus 의미 제거
           */
          onFocus={() => {
            if (state.isDisabled) return;
            setIsFocused(true);
            rest.onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            rest.onBlur?.();
          }}
          /**
           * state → class mapping
           * - CSS가 최종 스타일 결정
           * - priority: disabled > error > focus > readOnly > filled
           */
          inputClassName={cn(
            leftIcon && "has-left-icon",
            rightIcon && "has-right-icon",

            state.isDisabled && "input--disabled",
            state.isError && "input--error",
            state.isReadOnly && "input--readonly",

            // focus는 disabled일 때 절대 적용되지 않음
            state.isFocused && !state.isDisabled && "input--focus",

            state.isFilled && "input--filled",

            inputClassName,
          )}
        />

        {rightIcon && <div className="input-icon right">{rightIcon}</div>}
      </div>

      {/* =========================
       * Helper Text
       * ========================= */}
      <InputHelperText text={helperText} error={error} />
    </div>
  );
};
