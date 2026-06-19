"use client";

import { useState } from "react";
import { useUserRequestsQuery } from "@/features/support/requests/hooks/useUserRequestsQuery";

import AdminPagination from "@/features/admin/components/AdminPagination";
import { UserRequestQuery } from "../types/user-search";
import RequestTableToolbar from "./RequestTableToolbar";
import RequestTable from "./RequestTable";

const SupportRequestsClient = () => {
  const [query, setQuery] = useState<UserRequestQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: "title",
    sort: "createdAt",
    sortOrder: "desc",
  });

  const { data, isFetching, error } = useUserRequestsQuery(query);

  const requests = data?.items ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  if (error) return <div>문의 내역을 불러오는 중 오류가 발생했습니다.</div>;

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">1:1 문의 내역</h1>
        <p className="text-muted-foreground text-sm">
          접수하신 문의와 버그 신고 내역 및 처리 상태를 확인하세요.
        </p>
      </div>

      <div className="flex flex-1 flex-col space-y-4">
        <RequestTableToolbar query={query} onChange={setQuery} />

        <RequestTable
          requests={requests}
          isFetching={isFetching}
          query={query}
          onChange={setQuery}
        />

        {totalPages > 1 && (
          <AdminPagination
            page={query.page}
            totalPages={totalPages}
            onChange={(page) => setQuery((prev) => ({ ...prev, page }))}
          />
        )}
      </div>
    </div>
  );
};

export default SupportRequestsClient;
