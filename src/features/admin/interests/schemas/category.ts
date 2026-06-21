import { z } from "zod";

export const categorySchema = z.object({
  // 영문 소문자, 숫자, 하이픈만 허용하도록 강제
  slug: z
    .string()
    .min(1, "Slug는 필수입니다.")
    .regex(/^[a-z0-9-]+$/, "Slug는 소문자, 숫자, 하이픈만 사용할 수 있습니다."),
  name: z.string().min(1, "이름은 필수입니다."),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
