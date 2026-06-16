"use client";

import { useEffect } from "react";
import {
  DefaultValues,
  FieldValues,
  useForm,
  Path,
  SubmitHandler,
  useWatch,
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
import { RichEditor } from "./RichEditor";
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { ImagePreview } from "./ImagePreview";
import { uploadCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";

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
    // initialValues에서 값을 찾거나, 없을 경우 필드 타입에 따라 기본값 결정
    let value = initialValues
      ? (initialValues as Record<string, unknown>)[field.name]
      : undefined;

    // images 필드라면 빈 배열을 기본값으로 설정
    if (value === undefined || value === null) {
      value = field.name === "images" ? [] : "";
    }

    return { ...acc, [field.name]: value };
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

  const images = (useWatch({
    control: form.control,
    name: "images",
  }) ?? []) as ImageInfo[];

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
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
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
                            // 1. 설정값 동적 바인딩
                            accept={field.accept || "image/*"}
                            multiple={field.isMultiple || false}
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;

                              const currentImages =
                                form.getValues("images") || [];
                              const filesArray = Array.from(files);

                              // 2. 개수 제한 검증
                              if (field.maxFiles) {
                                const totalAfterUpload =
                                  currentImages.length + filesArray.length;
                                if (totalAfterUpload > field.maxFiles) {
                                  alert(
                                    `최대 ${field.maxFiles}개까지만 업로드 가능합니다. (현재: ${currentImages.length}개)`,
                                  );
                                  return;
                                }
                              }

                              try {
                                // 3. 업로드 로직 (기존 유지)
                                const uploadPromises = filesArray.map(
                                  async (file) => {
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    return await uploadCloudinaryImage(
                                      formData,
                                      field.folderName ||
                                        CLOUDINARY_FOLDERS.DEFAULT,
                                    );
                                  },
                                );

                                const newImages =
                                  await Promise.all(uploadPromises);

                                // 4. 상태 업데이트
                                form.setValue("images", [
                                  ...currentImages,
                                  ...newImages,
                                ]);
                              } catch (err) {
                                console.error("파일 업로드 실패:", err);
                                alert("파일 업로드 중 오류가 발생했습니다.");
                              }
                            }}
                          />
                        );
                      case "editor":
                        return (
                          <RichEditor
                            value={formField.value || ""}
                            onChange={formField.onChange}
                            placeholder={field.placeholder}
                            images={images}
                            onImagesChange={(newImages) =>
                              form.setValue("images", newImages)
                            }
                            folderName={
                              field.folderName || CLOUDINARY_FOLDERS.DEFAULT
                            }
                          />
                        );
                      case "hidden":
                        return (
                          <input
                            type="hidden"
                            {...formField}
                            // 리액트 훅 폼의 값을 강제로 동기화하기 위한 명시적 처리
                            value={
                              Array.isArray(formField.value)
                                ? JSON.stringify(formField.value)
                                : formField.value
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

        {/* 이미지 미리보기 영역 추가 */}
        {images.length > 0 && (
          <ImagePreview
            images={images}
            onDelete={(newImages) => {
              form.setValue("images", newImages); // 폼 상태 업데이트
            }}
          />
        )}
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
