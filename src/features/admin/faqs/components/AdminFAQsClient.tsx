import Link from "next/link";

const AdminFAQsClient = () => {
  const id = 1;
  return (
    <div>
      <p>FAQ 생성 및 수정</p>
      <Link href="faqs/new">새 FAQ 작성하기</Link>
      <Link href={`faqs/${id}/edit`}>faq 수정하기</Link>
    </div>
  );
};

export default AdminFAQsClient;
