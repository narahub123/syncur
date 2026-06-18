"use client";

import { Site } from "@/shared/types/site";
import { AdminTableToolbar } from "../../components/AdminTableToolbar";
import { AdminTable } from "../../components/AdminTable";
import { useTableSort } from "../../hooks/useTableSort";
import { useState } from "react";
import {
  ADMIN_SITE_PAGE_SIZE_OPTIONS,
  ADMIN_SITE_SEARCH_FIELD_OPTIONS,
  ADMIN_SITE_SEARCH_FIELDS,
  ADMIN_SITE_SORT_FIELDS,
  AdminSiteQuery,
  AdminSiteSort,
} from "../constants/search";
import { SORT_ORDER } from "@/shared/types/pagination";
import AdminPagination from "../../components/AdminPagination";
import { adminSiteColumns } from "../constants/search-columns";

export const mockSites: Site[] = [
  {
    _id: "1",
    name: "Velog dlakfjlkdfj ljal jasklfj lksjf slkjf ladsj lajflkasfjlsdkfjsdk",
    url: "https://velog.io/@abcfjdlfjsflslkfjasklfjalsdfkafdsfasfasdfasfasfef",
    favicon_url: null,
    feed_url: "https://v2.velog.io/rss/abc",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "2",
    name: "OpenAI Blog",
    url: "https://openai.com/blog",
    favicon_url: null,
    feed_url: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "3",
    name: "Tech Crunch",
    url: "https://techcrunch.com",
    favicon_url: null,
    feed_url: "https://techcrunch.com/feed/",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const AdminSitesClient = () => {
  const [query, setQuery] = useState<AdminSiteQuery>({
    page: 1,
    limit: 10,
    search: "",
    searchField: ADMIN_SITE_SEARCH_FIELDS.NAME,
    sort: ADMIN_SITE_SORT_FIELDS.CREATED_AT,
    sortOrder: SORT_ORDER.DESC,
  });

  const { sort, onSort } = useTableSort<AdminSiteQuery, AdminSiteSort>(
    query,
    setQuery,
  );

  const totalPages = 1;
  // data?.pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6 p-6">
      <AdminTableToolbar
        query={query}
        onChange={setQuery}
        searchFieldOptions={ADMIN_SITE_SEARCH_FIELD_OPTIONS}
        pageSizeOptions={ADMIN_SITE_PAGE_SIZE_OPTIONS}
      />
      <AdminTable
        columns={adminSiteColumns}
        data={mockSites}
        isFetching={false}
        sort={sort}
        onSort={onSort}
      />
      {totalPages !== 1 && (
        <AdminPagination
          page={query.page}
          totalPages={totalPages}
          onChange={(page) =>
            setQuery((prev) => ({
              ...prev,
              page,
            }))
          }
        />
      )}
    </div>
  );
};
