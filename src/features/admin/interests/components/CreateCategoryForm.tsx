"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { useDeleteCategoryMutation } from "../hooks/useDeleteCategoryMutation"; // 추가
import { toast } from "sonner";

type ServerActionResponse = {
  success: boolean;
  error?: string;
  data?: CategoryDTO;
};

interface Props {
  initialData?: CategoryDTO;
  onSuccess?: () => void;
}

export const CreateCategoryForm = ({ initialData, onSuccess }: Props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false); // 삭제 확인 상태 추가
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
  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCategoryMutation(); // 삭제 훅 추가

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { slug: "", name: "" },
  });

  const watchedName = useWatch({
    control: form.control,
    name: "name",
  });

  const watchedSlug = useWatch({
    control: form.control,
    name: "slug",
  });

  const isDirty = selectedCategory
    ? watchedName !== selectedCategory.name ||
      watchedSlug !== selectedCategory.slug
    : watchedName.trim().length > 0 && watchedSlug.trim().length > 0;

  useEffect(() => {
    if (initialData) {
      setSelectedCategory(initialData);
      form.reset({
        name: initialData.name,
        slug: initialData.slug,
      });
    } else {
      setSelectedCategory(null);
      form.reset({ name: "", slug: "" });
    }
  }, [initialData, form]);

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
            toast.error("카테고리 생성에 실패했습니다.");
          } else {
            toast.success("카테고리가 성공적으로 생성되었습니다.");
            onSuccess?.();
          }
        },
        onError: () => toast.error("시스템 오류가 발생했습니다."),
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
            toast.error("카테고리 수정에 실패했습니다.");
            return;
          }
          if (res.data) {
            setSelectedCategory(res.data);
            toast.success("카테고리가 성공적으로 수정되었습니다.");
            onSuccess?.();
          }
        },
        onError: () => toast.error("시스템 오류가 발생했습니다."),
      },
    );
  };

  // 삭제 실행 함수 추가
  const handleDelete = () => {
    if (!selectedCategory) return;
    deleteCategory(selectedCategory._id, {
      onSuccess: (res: ServerActionResponse) => {
        setIsDeleteConfirmOpen(false);
        if (res.success) {
          toast.success("카테고리가 삭제되었습니다.");
          onSuccess?.();
        } else {
          toast.error("삭제 실패: " + res.error);
        }
      },
      onError: () => toast.error("시스템 오류가 발생했습니다."),
    });
  };

  return (
    <section className="flex-1 space-y-6 rounded-lg border p-6">
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
                      form.clearErrors("slug");
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
                            form.clearErrors("slug");
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
                      form.clearErrors("slug");
                      field.onChange(e);
                    }}
                    placeholder="예: it-news"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!isDirty || isCreating || isUpdating || isDeleting}
              className="flex-1"
              variant={isEditMode ? "default" : "default"}
            >
              {isEditMode
                ? isUpdating
                  ? "수정 중..."
                  : "수정하기"
                : isCreating
                  ? "생성 중..."
                  : "생성하기"}
            </Button>

            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                disabled={isCreating || isUpdating || isDeleting}
                onClick={() => setIsDeleteConfirmOpen(true)}
                className="flex-1"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </Button>
            )}
          </div>
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

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="삭제 확인"
        description="정말로 이 카테고리를 삭제하시겠습니까?"
        onConfirm={handleDelete}
        confirm="삭제"
        confirmVariant="destructive"
      />
    </section>
  );
};
