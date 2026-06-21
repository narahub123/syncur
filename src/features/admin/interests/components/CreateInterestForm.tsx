"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { useCreateInterestMutation } from "../hooks/useCreateInterestMutation";
import { InterestFormData, interestSchema } from "../schemas/interest";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { CategoryDTO } from "@/features/interests/dtos/categoryDto";

export const CreateInterestForm = () => {
  const { data: categoriesData } = useCategoriesQuery();
  const { mutate: addInterest, isPending } = useCreateInterestMutation();

  const form = useForm<InterestFormData>({
    resolver: zodResolver(interestSchema),
    defaultValues: { slug: "", name: "", categoryId: "" },
  });

  const onSubmit = (data: InterestFormData) => {
    addInterest(data, {
      onSuccess: () => form.reset(),
    });
  };

  return (
    <section className="space-y-6 rounded-lg border p-6">
      <h2 className="text-xl font-semibold">새 관심사 생성</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* 카테고리 선택 (Select) */}
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리 선택</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesData?.data &&
                    Array.isArray(categoriesData.data) ? (
                      categoriesData.data.map((cat: CategoryDTO) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      // 데이터 로딩 중일 때 빈 선택지라도 제공하여 구조적 에러 방지
                      <SelectItem key="loading" value="loading" disabled>
                        로딩 중...
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="예: react" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="예: React" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "생성 중..." : "관심사 생성"}
          </Button>
        </form>
      </Form>
    </section>
  );
};
