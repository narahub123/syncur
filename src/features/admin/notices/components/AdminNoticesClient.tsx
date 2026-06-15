import Link from "next/link";

const AdminNoticesClient = () => {
  return (
    <div>
      <p>공지 사항</p>
      <Link href="notices/new">공지사항 등록하기</Link>
    </div>
  );
};

export default AdminNoticesClient;
