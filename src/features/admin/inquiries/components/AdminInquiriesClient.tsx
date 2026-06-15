import Link from "next/link";

const AdminInquiriesClient = () => {
  const id = 1;
  return (
    <div>
      문의
      <Link href={`inquiries/${id}`}>문의 답변하기</Link>
    </div>
  );
};

export default AdminInquiriesClient;
