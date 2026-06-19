import { Column, COLUMN_ALIGN } from "../../types/admin-table";
import { AdminSiteSort } from "../types/search";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar } from "@/shared/components/common/Avartar";
import { SiteDto } from "@/features/rss/site/dto/siteDto";
import Link from "next/link";

export const adminSiteColumns: Column<SiteDto, AdminSiteSort>[] = [
  {
    key: "name",
    header: "이름",
    render: (site: SiteDto) => (
      <div className="flex items-center gap-3">
        <Avatar
          src={site.favicon_url}
          name={site.name}
          variant="site"
          size="sm"
        />
        <span className="max-w-36 truncate font-medium">{site.name}</span>
      </div>
    ),
    sortable: true,
  },
  {
    key: "url",
    header: "URL",
    render: (site: SiteDto) => (
      <Link href={site.url} target="_blank">
        <span className="text-sm">{site.url}</span>
      </Link>
    ),
    sortable: true,
  },
  {
    key: "status",
    header: "RSS 상태",
    render: (site: SiteDto) => (
      <Badge variant={site.feed_url ? "default" : "destructive"}>
        {site.feed_url ? "RSS 가능" : "미탐색"}
      </Badge>
    ),
    align: COLUMN_ALIGN.CENTER,
    sortable: true,
  },
  {
    key: "createdAt",
    header: "최초 등록일",
    render: (site: SiteDto) => new Date(site.createdAt).toLocaleDateString(),
    align: COLUMN_ALIGN.CENTER,
    sortable: true,
  },
  {
    key: "updatedAt",
    header: "최근 갱신일",
    render: (site: SiteDto) => new Date(site.updatedAt).toLocaleDateString(),
    align: COLUMN_ALIGN.CENTER,
    sortable: true,
  },
] as const;
