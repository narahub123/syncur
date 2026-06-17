"use client";

import { useState } from "react";

import AdminPagination from "../../components/AdminPagination";
import { AdminRequestQuery } from "@/features/support/requests/types/admin-search";
import { useAdminRequestsQuery } from "@/features/support/requests/hooks/useAdminRequestsQuery";
import AdminInquiryTableToolbar from "./AdminInquiryTableToolbar";
import AdminInquiryTable from "./AdminInquiryTable";
import { REQUEST_TYPE } from "@/features/support/requests/constants/request-type";

const AdminInquiriesClient = () => {
  const [query, setQuery] = useState<AdminRequestQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: "title",
    sort: "createdAt",
    sortOrder: "desc",
    type: REQUEST_TYPE.INQUIRY,
  });

  const { data, isFetching } = useAdminRequestsQuery(query);
  const inquiries = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">1:1 문의 관리</h1>

      <AdminInquiryTableToolbar query={query} onChange={setQuery} />

      <AdminInquiryTable
        inquiries={inquiries}
        isFetching={isFetching}
        query={query}
        onChange={setQuery}
      />

      <AdminPagination
        page={query.page}
        totalPages={totalPages}
        onChange={(page) => setQuery((p) => ({ ...p, page }))}
      />
    </div>
  );
};

export default AdminInquiriesClient;
