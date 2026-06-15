import Link from "next/link";

const AdminBugReportsClient = () => {
  const id = 1;
  return (
    <div>
      <p>버그</p>
      <Link href={`bug-reports/${id}`}>버그 답변</Link>
    </div>
  );
};

export default AdminBugReportsClient;
