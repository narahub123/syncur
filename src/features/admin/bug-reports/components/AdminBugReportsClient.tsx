"use client";

import { REQUEST_TYPE } from "@/features/support/requests/constants/request-type";
import { useAdminRequestsQuery } from "@/features/support/requests/hooks/useAdminRequestsQuery";
import { AdminRequestQuery } from "@/features/support/requests/types/admin-search";
import { useState } from "react";
import AdminPagination from "../../components/AdminPagination";
import AdminBugReportTable from "./AdminBugReportTable";
import AdminBugReportTableToolbar from "./AdminBugReportTableToolbar";

const AdminBugReportsClient = () => {
  const [query, setQuery] = useState<AdminRequestQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: "title",
    sort: "createdAt",
    sortOrder: "desc",
    type: REQUEST_TYPE.BUG_REPORT,
  });

  const { data, isFetching } = useAdminRequestsQuery(query);
  const bug_reports = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <div className="mx-auto w-full max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold">버그 신고 관리</h1>

      <AdminBugReportTableToolbar query={query} onChange={setQuery} />

      <AdminBugReportTable
        inquiries={bug_reports}
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

export default AdminBugReportsClient;
