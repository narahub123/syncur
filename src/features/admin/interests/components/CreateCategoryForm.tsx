"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { categorySchema, CategoryFormData } from "../schemas/category";
import { CategoryDTO } from "@/features/interests/dtos/categoryDto";
import ConfirmDialog from "@/shared/components/common/ConfirmDialog";
import { useCreateCategoryMutation } from "../hooks/useCreateCategoryMutation";
import { useUpdateCategoryMutation } from "../hooks/useUpdateCategoryMutation";

type ServerActionResponse = {
  success: boolean;
  error?: string;
  data?: CategoryDTO;
};

export const CreateCategoryForm = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(
    null,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData } = useCategoriesQuery();
  const { mutate: addCategory, isPending: isCreating } =
    useCreateCategoryMutation();
  const { mutate: updateCategory, isPending: isUpdating } =
    useUpdateCategoryMutation();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { slug: "", name: "" },
  });

  const watchedName = form.watch("name");
  const watchedSlug = form.watch("slug");

  const isDirty = selectedCategory
    ? watchedName !== selectedCategory.name ||
      watchedSlug !== selectedCategory.slug
    : watchedName.trim().length > 0 && watchedSlug.trim().length > 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isEditMode = !!selectedCategory;

  const onSubmit = (data: CategoryFormData) => {
    if (isEditMode) {
      setIsConfirmOpen(true);
    } else {
      addCategory(data, {
        onSuccess: (res: ServerActionResponse) => {
          if (!res.success) {
            form.setError("slug", { message: res.error });
          }
        },
      });
    }
  };

  const handleConfirmUpdate = () => {
    const data = form.getValues();
    updateCategory(
      { id: selectedCategory!._id, data },
      {
        onSuccess: (res: ServerActionResponse) => {
          setIsConfirmOpen(false);
          if (!res.success) {
            form.setError("slug", { message: res.error });
            return;
          }
          if (res.data) setSelectedCategory(res.data);
        },
      },
    );
  };

  return (
    <section className="space-y-6 rounded-lg border p-6">
      <h2 className="text-xl font-semibold">
        {isEditMode ? "카테고리 수정" : "카테고리 관리"}
      </h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="relative" ref={dropdownRef}>
                <FormLabel>카테고리 이름</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    placeholder="이름을 입력하거나 선택하세요"
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                      form.clearErrors("slug"); // [에러 해결] 수정 시 에러 제거
                      field.onChange(e);
                      setShowDropdown(true);
                      if (selectedCategory) setSelectedCategory(null);
                    }}
                  />
                </FormControl>

                {showDropdown && (
                  <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                    {categoriesData?.data
                      ?.filter((cat) =>
                        cat.name
                          .toLowerCase()
                          .includes(field.value.toLowerCase()),
                      )
                      .map((cat) => (
                        <div
                          key={cat._id}
                          className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            form.clearErrors("slug"); // [에러 해결] 선택 시 에러 제거
                            setSelectedCategory(cat);
                            form.setValue("name", cat.name);
                            form.setValue("slug", cat.slug);
                            setShowDropdown(false);
                          }}
                        >
                          {cat.name}
                        </div>
                      ))}
                  </div>
                )}
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
                  <Input
                    {...field}
                    onChange={(e) => {
                      form.clearErrors("slug"); // [에러 해결] Slug 수정 시 에러 제거
                      field.onChange(e);
                    }}
                    placeholder="예: it-news"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={!isDirty || isCreating || isUpdating}
            className="w-full"
            variant={isEditMode ? "destructive" : "default"}
          >
            {isEditMode
              ? isUpdating
                ? "수정 중..."
                : "수정하기"
              : isCreating
                ? "생성 중..."
                : "생성하기"}
          </Button>
        </form>
      </Form>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="수정 확인"
        description="이 내용을 수정하시겠습니까?"
        onConfirm={handleConfirmUpdate}
        confirm="수정"
        confirmVariant="destructive"
      />
    </section>
  );
};
