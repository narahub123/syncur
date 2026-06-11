"use client";

import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";

const AdminUsersClient = () => {
  const { data, isLoading } = useAdminUsersQuery({});

  console.log(data, isLoading);

  return <div>사용자 페이지</div>;
};

export default AdminUsersClient;
