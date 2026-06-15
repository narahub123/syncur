import AdminBugReportReplyClient from "@/features/admin/bug-reports/components/AdminBugReportReplyClient";
import { mockBugReportExample } from "@/features/admin/mocks";

const AdminBugReportReplyPage = () => {
  return (
    <AdminBugReportReplyClient
      bugReport={mockBugReportExample}
      existingAnswer={
        null
        // mockBugExistingAnswer
      }
    />
  );
};

export default AdminBugReportReplyPage;
