"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { useCreateInterestMutation } from "../hooks/useCreateInterestMutation";
import { useUpdateInterestMutation } from "../hooks/useUpdateInterestMutation";
import { useDeleteInterestMutation } from "../hooks/useDeleteInterestMutation";
import { InterestFormData, interestSchema } from "../schemas/interest";
import { InterestDTO } from "@/features/interests/dtos/interestDto";
import { CategoryDTO } from "@/features/interests/dtos/categoryDto";
import ConfirmDialog from "@/shared/components/common/ConfirmDialog";
import { toast } from "sonner";

interface Props {
  categoryId: string;
  initialData?: InterestDTO;
  onSuccess?: () => void;
}

export const CreateInterestForm = ({
  categoryId,
  initialData,
  onSuccess,
}: Props) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { data: categoriesData } = useCategoriesQuery();

  const form = useForm<InterestFormData>({
    resolver: zodResolver(interestSchema),
    defaultValues: {
      categoryId,
      name: initialData?.name || "",
      slug: initialData?.slug || "",
    },
  });

  const watchedName = form.watch("name");
  const watchedSlug = form.watch("slug");
  const watchedCategoryId = form.watch("categoryId");

  const isDirty = initialData
    ? watchedName !== initialData.name ||
      watchedSlug !== initialData.slug ||
      watchedCategoryId !== initialData.categoryId
    : watchedName.trim().length > 0 &&
      watchedSlug.trim().length > 0 &&
      watchedCategoryId.trim().length > 0;

  const { mutate: addInterest, isPending: isCreating } =
    useCreateInterestMutation();
  const { mutate: updateInterest, isPending: isUpdating } =
    useUpdateInterestMutation();
  const { mutate: deleteInterest, isPending: isDeleting } =
    useDeleteInterestMutation();

  const isEditMode = !!initialData;

  const onSubmit = (data: InterestFormData) => {
    if (isEditMode) {
      setIsConfirmOpen(true);
    } else {
      addInterest(data, {
        onSuccess: (res) => {
          if (res.success) {
            toast.success("관심사가 추가되었습니다.");
            onSuccess?.();
          } else {
            form.setError("slug", { message: res.error });
            toast.error("생성 실패");
          }
        },
      });
    }
  };

  const handleConfirmUpdate = () => {
    if (!initialData) return;
    updateInterest(
      { id: initialData._id, data: form.getValues() },
      {
        onSuccess: (res) => {
          setIsConfirmOpen(false);
          if (res.success) {
            toast.success("수정되었습니다.");
            onSuccess?.();
          } else {
            toast.error("수정 실패");
          }
        },
      },
    );
  };

  const handleDelete = () => {
    if (!initialData) return;
    deleteInterest(initialData._id, {
      onSuccess: (res) => {
        setIsDeleteConfirmOpen(false);
        if (res.success) {
          toast.success("삭제되었습니다.");
          onSuccess?.();
        } else {
          toast.error("삭제 실패");
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select
                  disabled
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesData?.data?.map((cat: CategoryDTO) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>관심사 이름</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="관심사 이름을 입력하세요" />
                </FormControl>
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
                    value={
                      field.value.includes("/")
                        ? field.value.split("/").pop()
                        : field.value
                    }
                    onChange={(e) => {
                      const shortSlug = e.target.value;
                      const prefix = field.value.includes("/")
                        ? field.value.split("/").slice(0, -1).join("/") + "/"
                        : "";
                      field.onChange(`${prefix}${shortSlug}`);
                    }}
                    placeholder="예: react"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              className="flex-1"
              disabled={!isDirty || isCreating || isUpdating || isDeleting}
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
                삭제
              </Button>
            )}
          </div>
        </form>
      </Form>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        title="수정 확인"
        description="내용을 수정하시겠습니까?"
        onConfirm={handleConfirmUpdate}
        confirm="수정"
      />

      <ConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="삭제 확인"
        description="정말로 이 관심사를 삭제하시겠습니까?"
        onConfirm={handleDelete}
        confirm="삭제"
        confirmVariant="destructive"
      />
    </div>
  );
};
