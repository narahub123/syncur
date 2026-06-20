import AdminBugReportReplyClient from "@/features/admin/bug-reports/components/AdminBugReportReplyClient";
import { BugReportStatus } from "@/features/admin/bug-reports/types/search";
import { getRequestAction } from "@/features/support/requests/actions/getRequestAction";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Next.js 15+ 파라미터 처리
}

export default async function AdminBugReportReplyPage({ params }: PageProps) {
  const { id } = await params;

  // 1. 서버에서 데이터 조회 (작성자 정보 + 답변 정보 포함)
  const bugReportData = await getRequestAction(id);

  if (!bugReportData) {
    return notFound();
  }
  return (
    <AdminBugReportReplyClient
      bugReport={{
        _id: bugReportData._id,
        user: bugReportData.user || null,
        title: bugReportData.title,
        content: bugReportData.content,
        createdAt: new Date(bugReportData.createdAt).toLocaleDateString(),
        currentStatus: bugReportData.status as BugReportStatus,
        metadata: bugReportData.metadata,
      }}
      // 답변이 있으면 기존 답변 데이터를 넘겨 수정 모드로 전환
      existingAnswer={
        bugReportData.adminReply
          ? {
              replyContent: bugReportData.adminReply.replyContent,
              images: bugReportData.adminReply.images,
              status: bugReportData.status as BugReportStatus,
            }
          : null
      }
    />
  );
}
