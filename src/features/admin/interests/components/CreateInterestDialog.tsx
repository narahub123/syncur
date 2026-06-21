"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { CreateInterestForm } from "./CreateInterestForm";
import { InterestDTO } from "@/features/interests/dtos/interestDto";

export const CreateInterestDialog = ({
  categoryId,
  categoryName,
  interestData, // 수정 시 전달할 데이터
  trigger, // 커스텀 버튼/태그
}: {
  categoryId: string;
  categoryName: string;
  interestData?: InterestDTO;
  trigger?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="cursor-pointer text-xs text-blue-500 hover:underline">
            + 관심사 추가
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {interestData
              ? `"${interestData.name}" 수정`
              : `"${categoryName}"에 관심사 추가`}
          </DialogTitle>
        </DialogHeader>

        <CreateInterestForm
          categoryId={categoryId}
          initialData={interestData}
          onSuccess={() => setOpen(false)} // 작업 성공 시 다이얼로그 닫기
        />
      </DialogContent>
    </Dialog>
  );
};
