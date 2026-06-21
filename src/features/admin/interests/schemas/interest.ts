import { z } from "zod";

export const interestSchema = z.object({
  slug: z.string().min(1, "Slug는 필수입니다.").toLowerCase(),
  name: z.string().min(1, "관심사 이름은 필수입니다."),
  categoryId: z.string().min(1, "카테고리는 필수입니다."),
});

export type InterestFormData = z.infer<typeof interestSchema>;
