"use client";

import {
  REQUEST_STATUS,
  REQUEST_TYPE,
} from "@/features/support/requests/constants/request-type";
import { useRequestDetailQuery } from "../hooks/useRequestDetailQuery";
import { BUG_CATEGORY_OPTIONS } from "../../bug-reports/types/bugReport";
import { INQUIRY_CATEGORIES_OPTIONS } from "../../inquiries/types/inquiries";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { Button } from "@/shared/components/ui/button";
import { ImagePreview } from "@/shared/components/common/ImagePreview";

export default function SupportRequestDetailClient({
  requestId,
}: {
  requestId: string;
}) {
  const router = useRouter();
  const { data: request, isLoading, error } = useRequestDetailQuery(requestId);

  if (isLoading) return <div className="p-6">불러오는 중...</div>;
  if (error || !request)
    return <div className="p-6">문의 내역을 찾을 수 없습니다.</div>;

  console.log("사아ㅇㄴ으ㅜㄴ일나ㅣ런ㅇㄹ", request.adminReply?.images);
  const handleEdit = () => {
    if (!request) return;
    router.push(`${ROUTES.SUPPORT_REQUESTS}/${request._id}/edit`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      {/* 1. 헤더: 제목 및 상태 */}
      <div className="space-y-3 border-b pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* 상태 배지 */}
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium ${
              request.status === REQUEST_STATUS.COMPLETED
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {request.status === REQUEST_STATUS.COMPLETED
              ? "답변 완료"
              : "처리 중"}
          </span>

          {/* 유형 배지 */}
          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
            {request.type === REQUEST_TYPE.BUG_REPORT
              ? "버그 신고"
              : "일반 문의"}
          </span>

          {/* 카테고리 배지 (제공해주신 상수 활용) */}
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {/* 💡 카테고리 라벨을 찾는 로직 */}
            {[...BUG_CATEGORY_OPTIONS, ...INQUIRY_CATEGORIES_OPTIONS].find(
              (opt) => opt.value === request.metadata?.category,
            )?.label || "기타"}
          </span>

          <span className="text-muted-foreground ml-auto text-sm">
            {new Date(request.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{request.title}</h1>
          {!request.adminReply && (
            <Button variant="outline" onClick={handleEdit}>
              수정하기
            </Button>
          )}
        </div>
      </div>

      {/* 2. 문의 본문 */}
      <div className="rounded-lg border bg-slate-50 p-6">
        <h2 className="text-muted-foreground mb-2 text-sm font-semibold">
          문의 내용
        </h2>
        <p className="whitespace-pre-wrap">{request.content}</p>
        <ImagePreview
          images={request.metadata?.images || []}
          onDelete={() => {}}
          canDelete={false}
        />
      </div>

      {/* 3. 관리자 답변 영역 (답변이 있는 경우에만) */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
          관리자 답변
        </h2>

        {request.status === REQUEST_STATUS.COMPLETED ? (
          // 답변이 완료된 경우
          <div className="whitespace-pre-wrap text-gray-700">
            <div>{request.adminReply?.replyContent}</div>
            <ImagePreview
              images={request.adminReply?.images || []}
              onDelete={() => {}}
              canDelete={false}
            />
          </div>
        ) : (
          // 답변이 대기 중인 경우
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-100 py-8 text-center">
            <p className="font-medium text-gray-500">
              현재 답변을 준비 중입니다.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              문의하신 내용은 순차적으로 확인 후 답변드릴 예정입니다. 조금만
              기다려 주세요.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
