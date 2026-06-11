"use client";

import { useAdminFeedsQuery } from "../hooks/useAdminFeedsQuery";

const AdminFeedsClient = () => {
  const { data, isLoading } = useAdminFeedsQuery({});

  console.log(data, isLoading);
  return <div>피드 페이지</div>;
};

export default AdminFeedsClient;
