"use client";

import { useEffect } from "react"; // ◀ useEffect 추가
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
  initialValues?: DefaultValues<T>; // 수정 모드를 위한 초기값
}

export function DynamicForm<T extends FieldValues>({
  configs,
  onSubmit,
  submitLabel = "제출하기",
  initialValues, // ◀ Props 받아오기
}: DynamicFormProps<T>) {
  const formSchema = createDynamicSchema(configs);

  // 2. 기본값 계산할 때 initialValues가 있으면 그걸 먼저 쓰고, 없으면 빈 문자열("") 세팅
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

  // ◀ 3. 서버에서 데이터를 뒤늦게 받아오는 경우(비동기)를 위해 reset 로직 추가
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
                            value={formField.value} // ◀ 비동기 데이터 매핑용 value 명시
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

        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "전송 중..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
