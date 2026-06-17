import AdminInquiryReplyClient from "@/features/admin/inquiries/components/AdminInquiryReplyClient";
import { AnswerStatus, InquiryStatus } from "@/features/admin/inquiries/types";
import { getRequestAction } from "@/features/support/requests/actions/getRequestAction";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Next.js 15+ 파라미터 처리
}

export default async function AdminInquiryReplyPage({ params }: PageProps) {
  const { id } = await params;

  // 1. 서버에서 데이터 조회 (작성자 정보 + 답변 정보 포함)
  const inquiryData = await getRequestAction(id);

  if (!inquiryData) {
    return notFound();
  }

  // 2. 클라이언트 컴포넌트로 데이터 전달
  return (
    <AdminInquiryReplyClient
      inquiry={{
        id: inquiryData._id,
        user: inquiryData.user || null,
        title: inquiryData.title,
        content: inquiryData.content,
        createdAt: new Date(inquiryData.createdAt).toLocaleDateString(),
        currentStatus: inquiryData.status as InquiryStatus,
        metadata: inquiryData.metadata,
      }}
      // 답변이 있으면 기존 답변 데이터를 넘겨 수정 모드로 전환
      existingAnswer={
        inquiryData.adminReply
          ? {
              replyContent: inquiryData.adminReply.replyContent,
              images: inquiryData.adminReply.images,
              status: inquiryData.status as AnswerStatus,
            }
          : null
      }
    />
  );
}
