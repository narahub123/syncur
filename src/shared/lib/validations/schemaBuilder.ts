import { FormFieldConfig } from "@/shared/types/form";
import { z } from "zod";

export function createDynamicSchema(configs: FormFieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  configs.forEach((field) => {
    // 1. 타입에 따른 기본 Zod 검증기 설정
    let validator: z.ZodTypeAny;

    if (field.type === "hidden" && field.name === "images") {
      // images는 배열 타입으로 정의
      validator = z.array(
        z.object({
          url: z.string(),
          publicId: z.string(),
        }),
      );
    } else {
      // 나머지(text, textarea, select, editor 등)는 문자열 기반
      validator = z.string();

      if (field.name === "email") {
        validator = (validator as z.ZodString).email({
          message: "올바른 이메일 형식이 아닙니다.",
        });
      }

      if (field.required) {
        validator = (validator as z.ZodString).min(1, {
          message: `${field.label}은(는) 필수 입력 항목입니다.`,
        });
      } else {
        validator = validator.optional().or(z.literal(""));
      }
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
}
