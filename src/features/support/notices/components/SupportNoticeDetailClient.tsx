"use client";

import { NoticeResponseDTO } from "@/features/support/notices/dtos";
import { Button } from "@/shared/components/ui/button"; // 프로젝트 공통 컴포넌트 사용
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useNoticeDetailQuery } from "../actions/useNoticeDetailQuery";

type Props = {
  initialData: NoticeResponseDTO;
};

const SupportNoticeDetailClient = ({ initialData }: Props) => {
  const router = useRouter();

  // 서버로부터 전달받은 initialData를 사용하여 캐시 초기화
  const { data } = useNoticeDetailQuery(initialData._id);
  const notice = data ?? initialData;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      {/* 상단 네비게이션 및 헤더 */}
      <div className="mb-8">
        <Button
          variant="ghost"
          className="mb-4 pl-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{notice.title}</h1>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <span>
              {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
            </span>
            <span className="bg-border h-4 w-px" />
            <span>조회수 {notice.views}</span>
          </div>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="bg-card min-h-100 w-full rounded-lg border p-8 shadow-sm">
        <div className="prose prose-stone dark:prose-invert max-w-none">
          {/* 본문 내용: 줄바꿈 처리를 위해 whitespace-pre-wrap 사용 */}
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>
      </div>

      {/* 하단 액션 버튼 */}
      <div className="mt-6 flex justify-end">
        <Button variant="outline" onClick={() => router.push("/notices")}>
          목록으로
        </Button>
      </div>
    </div>
  );
};

export default SupportNoticeDetailClient;
