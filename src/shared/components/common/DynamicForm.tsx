"use client";

import { useEffect } from "react";
import {
  DefaultValues,
  FieldValues,
  useForm,
  Path,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button";
import { FormFieldConfig } from "@/shared/types/form";
import { createDynamicSchema } from "@/shared/lib/validations/schemaBuilder";

interface DynamicFormProps<T extends FieldValues> {
  configs: FormFieldConfig[];
  onSubmit: (data: T) => void;
  submitLabel?: string;
  initialValues?: DefaultValues<T>;
  footer?: React.ReactNode; // 💡 폼 하단부 커스텀 영역(삭제 버튼 등 배치용)
}

export function DynamicForm<T extends FieldValues>({
  configs,
  onSubmit,
  submitLabel = "제출하기",
  initialValues,
  footer, // 💡 Props로 전달받음
}: DynamicFormProps<T>) {
  const formSchema = createDynamicSchema(configs);

  // 기본값 설정: 초기값이 있으면 적용, 없으면 빈 문자열로 초기화
  const defaultValues = configs.reduce((acc, field) => {
    const fallbackValue = initialValues
      ? (initialValues as Record<string, unknown>)[field.name]
      : "";
    return { ...acc, [field.name]: fallbackValue ?? "" };
  }, {} as DefaultValues<FieldValues>);

  const form = useForm<FieldValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // 서버 데이터 비동기 로딩 대응: initialValues 변경 시 폼 상태 리셋
  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues as DefaultValues<FieldValues>);
    }
  }, [initialValues, form]);

  const handleFormSubmit: SubmitHandler<FieldValues> = (data) => {
    onSubmit(data as T);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6"
      >
        {/* 폼 필드 렌더링 */}
        {configs.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name as Path<FieldValues>}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  {(() => {
                    switch (field.type) {
                      case "text":
                        return (
                          <Input
                            placeholder={field.placeholder}
                            {...formField}
                          />
                        );
                      case "textarea":
                        return (
                          <Textarea
                            placeholder={field.placeholder}
                            {...formField}
                          />
                        );
                      case "select":
                        return (
                          <Select
                            onValueChange={formField.onChange}
                            defaultValue={formField.value}
                            value={formField.value}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  field.placeholder || "선택해 주세요"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      case "file":
                        return (
                          <Input
                            type="file"
                            name={formField.name}
                            ref={formField.ref}
                            onBlur={formField.onBlur}
                            onChange={(e) =>
                              formField.onChange(e.target.files?.[0])
                            }
                          />
                        );
                      default:
                        return <input type="hidden" {...formField} />;
                    }
                  })()}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {/* 💡 하단 푸터 영역: 폼 제출 버튼과 분리된 기능(삭제 버튼 등)을 렌더링 */}
        <div className="border-t pt-4">
          <div className="flex w-full items-center justify-between">
            {/* 왼쪽: 삭제 버튼 등이 위치하는 푸터 영역 */}
            <div className="flex items-center">{footer}</div>

            {/* 오른쪽: 제출 버튼 (항상 노출) */}
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "전송 중..." : submitLabel}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
