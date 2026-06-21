"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useCategoriesWithInterestsQuery } from "../hooks/useCategoriesWithInterestsQuery";
import { CreateCategoryForm } from "./CreateCategoryForm";
import { CreateInterestDialog } from "./CreateInterestDialog";

export const CategoryListSection = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useCategoriesWithInterestsQuery();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  if (isLoading) return <CategorySkeleton />;
  if (error)
    return <div className="p-4 text-red-500">데이터를 불러올 수 없습니다.</div>;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold">카테고리 및 관심사 관리</h3>
        {/* 카테고리 추가 버튼 (기존 유지) */}
        <Dialog
          open={isCategoryDialogOpen}
          onOpenChange={setIsCategoryDialogOpen}
        >
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> 카테고리 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-150">
            <DialogHeader>
              <DialogTitle>카테고리 관리</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <CreateCategoryForm />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {categories?.map((category) => (
          <div key={category._id} className="border-b pb-4">
            {/* 1. 카테고리 이름과 수정 버튼 */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-lg font-bold">{category.name}</span>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    카테고리 수정
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-150">
                  <DialogHeader>
                    <DialogTitle>카테고리 수정</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    {/* 여기에 수정용 데이터(initialData)를 넘겨줍니다 */}
                    <CreateCategoryForm initialData={category} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 2. 관심사 목록과 그 옆에 '관심사 추가' 버튼 */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {category.interests.map((interest) => (
                  <CreateInterestDialog
                    key={interest._id}
                    categoryId={category._id}
                    categoryName={category.name}
                    interestData={interest}
                    trigger={
                      <span className="cursor-pointer rounded-full bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200">
                        {interest.name}
                      </span>
                    }
                  />
                ))}
              </div>

              {/* 관심사 추가 버튼을 목록 옆으로 이동 */}
              <CreateInterestDialog
                categoryId={category._id}
                categoryName={category.name}
                trigger={
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-1"
                  >
                    <Plus className="h-3 w-3" /> 관심사 추가
                  </Button>
                }
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const CategorySkeleton = () => (
  <div className="space-y-4 p-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-24 w-full" />
  </div>
);
``;
