"use client";

import { DynamicForm } from "@/shared/components/common/DynamicForm";
import { faqFormConfig, FaqFormValues } from "../types";
import { useCreateFaqMutation } from "@/features/support/faqs/hooks/useCreateFaqMutation";
import { useUpdateFaqMutation } from "@/features/support/faqs/hooks/useUpdateFaqMutation"; // 💡 추가
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { DeleteButton } from "@/shared/components/common/DeleteButton";
import { Button } from "@base-ui/react";
import { useDeleteFaqMutation } from "@/features/support/faqs/hooks/useDeleteFaqMutation";

interface AdminFAQNewClientProps {
  faqId?: string;
  initialData?: FaqFormValues;
}

export default function AdminFAQNewClient({
  faqId,
  initialData,
}: AdminFAQNewClientProps) {
  const router = useRouter();

  const isEditMode = Boolean(faqId);

  // 💡 각각의 Mutation 훅 호출
  const { mutate: createFaq } = useCreateFaqMutation();
  const { mutate: updateFaq } = useUpdateFaqMutation(faqId || "");

  const handleFaqSubmit = async (data: FaqFormValues) => {
    // 1. 공통 데이터 가공
    const payload = {
      ...data,
      sortOrder: parseInt(data.sortOrder, 10) || 10,
      isPublished: data.isPublished === "공개",
    };

    if (isEditMode) {
      // 💡 [수정 로직] Mutation 실행
      updateFaq(payload, {
        onSuccess: () => {
          toast.success("FAQ가 성공적으로 수정되었습니다.");
        },
        onError: (error) => {
          console.error(error);
          toast.error("FAQ 수정 중 오류가 발생했습니다.");
        },
      });
    } else {
      // 💡 [등록 로직] Mutation 실행
      createFaq(payload, {
        onSuccess: () => {
          toast.success("새로운 FAQ가 성공적으로 등록되었습니다.");
        },
        onError: (error) => {
          console.error(error);
          toast.error("FAQ 등록 중 오류가 발생했습니다.");
        },
      });

      router.push(ROUTES.ADMIN_FAQS);
    }
  };

  const { mutate: deleteFaq } = useDeleteFaqMutation();

  return (
    <div className="bg-background mx-auto w-full max-w-2xl rounded-xl border p-6 shadow-sm">
      <Link
        href="/admin/faqs"
        className="text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1 text-sm transition"
      >
        <ArrowLeft size={16} />
        <span>FAQ 목록으로 돌아가기</span>
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "FAQ 수정하기" : "새 FAQ 등록"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isEditMode
            ? "사용자 고객센터에 게시된 자주 묻는 질문 내용을 수정합니다."
            : "유저들이 고객센터에서 스스로 문제를 해결할 수 있도록 자주 묻는 질문을 추가합니다."}
        </p>
      </div>

      <DynamicForm<FaqFormValues>
        configs={faqFormConfig}
        onSubmit={handleFaqSubmit}
        initialValues={initialData}
        submitLabel={isEditMode ? "FAQ 수정 완료" : "FAQ 등록하기"}
        footer={
          isEditMode ? (
            <DeleteButton onDelete={() => deleteFaq(faqId!)} />
          ) : null
        }
      />
    </div>
  );
}
