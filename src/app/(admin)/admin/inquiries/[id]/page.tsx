import AdminInquiryReplyClient from "@/features/admin/inquiries/components/AdminInquiryReplyClient";
import {
  mockInquiryExample,
  mockInquiryExistingAnswer,
} from "@/features/admin/mocks";

const AdminInquiryReplyPage = () => {
  return (
    <AdminInquiryReplyClient
      inquiry={mockInquiryExample}
      existingAnswer={mockInquiryExistingAnswer}
    />
  );
};

export default AdminInquiryReplyPage;
