"use client";

import { useState, useEffect } from "react";
import { useUserInterestSelectionTreeQuery } from "@/features/interests/hooks/useUserInterestSelectionTreeQuery";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { InterestSelectionDTO } from "../dtos/userInterestDto";
import { getCategoryTheme } from "../utils/color";
import { IINTEREST_CONFIG } from "../constants/interest-config";
import { toast } from "sonner";
import { InterestDTO } from "../dtos/interestDto";

interface InterestListProps {
  initialSelections?: InterestSelectionDTO[];
  onSelectionChange: (selections: InterestSelectionDTO[]) => void;
}

export function InterestList({
  initialSelections,
  onSelectionChange,
}: InterestListProps) {
  const { data: categories, isLoading } = useUserInterestSelectionTreeQuery();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 초기값 로드
  useEffect(() => {
    const ids = new Set<string>();

    // 1. props로 받은 데이터 우선순위
    if (initialSelections) {
      initialSelections.forEach((s) =>
        s.interestIds.forEach((i) => ids.add(i)),
      );
    }
    // 2. 서버 데이터 기반 초기값
    else if (categories) {
      categories.forEach((cat) =>
        cat.interests.forEach((i) => {
          if (i.isSelected) ids.add(i._id);
        }),
      );
    }
    setSelectedIds(ids);
  }, [initialSelections, categories]);

  const toggleInterest = (interest: InterestDTO) => {
    const next = new Set(selectedIds);
    if (next.has(interest._id)) {
      next.delete(interest._id);
    } else {
      // 10개 제한 체크
      if (next.size >= IINTEREST_CONFIG.MAX_LIMIT) {
        toast.error(
          `최대 ${IINTEREST_CONFIG.MAX_LIMIT}개까지만 선택 가능합니다.`,
        );
        return;
      }
      next.add(interest._id);
    }

    setSelectedIds(next);

    if (categories) {
      // 선택된 ID를 기반으로 DTO 배열 생성
      const newSelections: InterestSelectionDTO[] = categories
        .filter((cat) => cat.interests.some((i) => next.has(i._id)))
        .map((cat) => ({
          categoryId: cat._id, // string
          interestIds: cat.interests
            .filter((i) => next.has(i._id))
            .map((i) => i._id), // string[]
        }));
      onSelectionChange(newSelections);
    }
  };

  if (isLoading) return <InterestListSkeleton />;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {categories?.map((category) => (
        <Card key={category._id} className="border-slate-100 shadow-sm">
          {/* CardHeader의 py를 줄이고, CardContent의 pt(padding-top)를 0으로 설정해 밀착시킴 */}
          <CardHeader className="px-4 py-3 pb-0">
            <CardTitle className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {category.name}
            </CardTitle>
          </CardHeader>
          {/* pt-2를 통해 제목과 배지 사이의 간격을 최소한으로 유지 */}
          <CardContent className="flex flex-wrap gap-1.5 px-4 pt-2 pb-4">
            {category.interests.map((interest) => {
              const isSelected = selectedIds.has(interest._id);
              const theme = getCategoryTheme(category._id);

              return (
                <Badge
                  key={interest._id}
                  className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-all ${
                    isSelected
                      ? theme.dark
                      : `${theme.light} hover:border-current`
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest.name}
                </Badge>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function InterestListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border-none bg-slate-50 shadow-none">
          <CardHeader>
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
