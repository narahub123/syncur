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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { useCategoriesQuery } from "../hooks/useCategoriesQuery";
import { useInterestsQuery } from "../hooks/useInterestsQuery";
import { useCreateInterestMutation } from "../hooks/useCreateInterestMutation";
import { useUpdateInterestMutation } from "../hooks/useUpdateInterestMutation";
import { InterestFormData, interestSchema } from "../schemas/interest";
import { InterestDTO } from "@/features/interests/dtos/interestDto";
import { CategoryDTO } from "@/features/interests/dtos/categoryDto";
import ConfirmDialog from "@/shared/components/common/ConfirmDialog";
import { toast } from "sonner";

type ServerActionResponse = {
  success: boolean;
  error?: string;
  data?: InterestDTO;
};

export const CreateInterestForm = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState<InterestDTO | null>(
    null,
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData } = useCategoriesQuery();

  const form = useForm<InterestFormData>({
    resolver: zodResolver(interestSchema),
    defaultValues: { slug: "", name: "", categoryId: "" },
  });

  const watchedName = form.watch("name");
  const watchedSlug = form.watch("slug");
  const watchedCategoryId = form.watch("categoryId");

  const { data: interestsData } = useInterestsQuery({
    categoryId: watchedCategoryId,
    keyword: watchedName,
  });

  const { mutate: addInterest, isPending: isCreating } =
    useCreateInterestMutation();
  const { mutate: updateInterest, isPending: isUpdating } =
    useUpdateInterestMutation();

  const isEditMode = !!selectedInterest;
  const isDirty = selectedInterest
    ? watchedName !== selectedInterest.name ||
      watchedSlug !== selectedInterest.slug ||
      watchedCategoryId !== selectedInterest.categoryId
    : watchedName.trim().length > 0 &&
      watchedSlug.trim().length > 0 &&
      watchedCategoryId.trim().length > 0;

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

  const onSubmit = (data: InterestFormData) => {
    if (isEditMode) {
      setIsConfirmOpen(true);
    } else {
      addInterest(data, {
        onSuccess: (res: ServerActionResponse) => {
          if (!res.success) {
            form.setError("slug", { type: "manual", message: res.error });
            toast.error("관심사 생성에 실패했습니다.");
          } else {
            toast.success("관심사가 성공적으로 생성되었습니다.");
            if (res.data) {
              setSelectedInterest(res.data);
            }
          }
        },
        onError: () => toast.error("시스템 오류가 발생했습니다."),
      });
    }
  };

  const handleConfirmUpdate = () => {
    const data = form.getValues();
    if (!selectedInterest) return;
    updateInterest(
      { id: selectedInterest._id, data },
      {
        onSuccess: (res: ServerActionResponse) => {
          setIsConfirmOpen(false);
          if (!res.success) {
            form.setError("slug", { type: "manual", message: res.error });
            toast.error("관심사 수정에 실패했습니다.");
          } else {
            toast.success("관심사가 성공적으로 수정되었습니다.");
            if (res.data) {
              setSelectedInterest(res.data);
            }
          }
        },
        onError: () => toast.error("시스템 오류가 발생했습니다."),
      },
    );
  };

  return (
    <section className="space-y-6 rounded-lg border p-6">
      <h2 className="text-xl font-semibold">
        {isEditMode ? "관심사 수정" : "관심사 관리"}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>카테고리</FormLabel>
                <Select
                  onValueChange={(val) => {
                    form.clearErrors();
                    field.onChange(val);
                    setSelectedInterest(null);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리를 선택하세요" />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="relative" ref={dropdownRef}>
                <FormLabel>관심사 이름</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    autoComplete="off"
                    onFocus={() => setShowDropdown(true)}
                    onChange={(e) => {
                      form.clearErrors();
                      field.onChange(e);
                      setShowDropdown(true);
                      if (selectedInterest) setSelectedInterest(null);
                    }}
                  />
                </FormControl>
                {showDropdown && interestsData?.data && (
                  <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                    {interestsData.data.map((item: InterestDTO) => (
                      <div
                        key={item._id}
                        className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => {
                          form.clearErrors();
                          setSelectedInterest(item);
                          form.setValue("name", item.name);
                          form.setValue("slug", item.slug);
                          form.setValue("categoryId", item.categoryId);
                          setShowDropdown(false);
                        }}
                      >
                        {item.name}
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
                    placeholder="예: react"
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
