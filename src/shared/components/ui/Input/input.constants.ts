import { InputSize } from "./input.types";

export const INPUT_SIZE_MAP: Record<
  InputSize,
  {
    height: string;
    fontSize: string;
    paddingX: string;
  }
> = {
  sm: {
    height: "32px",
    fontSize: "13px",
    paddingX: "10px",
  },
  md: {
    height: "40px",
    fontSize: "14px",
    paddingX: "12px",
  },
  lg: {
    height: "48px",
    fontSize: "15px",
    paddingX: "14px",
  },
};
