import AdminUserClient from "@/features/admin/users/components/AdminUserClient";

interface Props {
  params: Promise<{ id: string }>;
}

const AdminUserPage = async ({ params }: Props) => {
  const { id } = await params;

  return <AdminUserClient userId={id} />;
};

export default AdminUserPage;
