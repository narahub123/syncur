import { InputProps } from "./input.types";

export const getInputState = (props: InputProps) => {
  return {
    isDisabled: !!props.disabled,
    isError: !!props.error,
    isReadOnly: !!props.readOnly,
    isFilled: !!props.value?.length,
  };
};
