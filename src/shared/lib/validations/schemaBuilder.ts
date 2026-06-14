import { FormFieldConfig } from "@/shared/types/form";
import { z } from "zod";

export function createDynamicSchema(configs: FormFieldConfig[]) {
  // 1. 인덱스 시그니처 타입을 명확히 정의합니다.
  const shape: Record<string, z.ZodTypeAny> = {};

  configs.forEach((field) => {
    // 2. 먼저 순수한 ZodString으로 시작합니다.
    let validator: z.ZodTypeAny = z.string();

    // 3. 특수 형식(이메일 등) 검증을 '가장 먼저' 처리합니다. (ZodString 메서드 활용)
    if (field.name === "email") {
      validator = z
        .string()
        .email({ message: "올바른 이메일 형식이 아닙니다." });
    }

    // 4. 그 다음에 필수(required) 여부에 따라 타입을 변환합니다.
    if (field.required) {
      // 이미 email 검증이 들어간 상태라면 해당 메시지를 유지하기 위해 분기 처리
      if (field.name !== "email") {
        validator = (validator as z.ZodString).min(1, {
          message: `${field.label}은(는) 필수 입력 항목입니다.`,
        });
      }
    } else {
      // 필수 항목이 아니면 빈 문자열이나 undefined를 허용하도록 Union 처리
      validator = validator.optional().or(z.literal(""));
    }

    shape[field.name] = validator;
  });

  return z.object(shape);
}
