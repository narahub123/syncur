import AdminNoticesNewClient from "@/features/admin/notices/components/AdminNoticesNewClient";
import { getAdminNoticeDetailAction } from "@/features/admin/notices/actions/getAdminNoticeDetailAction";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

const AdminNoticesEditPage = async ({ params }: Props) => {
  const { id } = await params;

  const initialNotice = await getAdminNoticeDetailAction(id);

  if (!initialNotice) {
    notFound();
  }

  const initialData = {
    ...initialNotice,
    isPinned: initialNotice.isPinned ? "fixed" : "normal",
  };

  return <AdminNoticesNewClient noticeId={id} initialData={initialData} />;
};

export default AdminNoticesEditPage;
