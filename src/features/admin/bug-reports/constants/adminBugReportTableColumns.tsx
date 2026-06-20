import { Column, COLUMN_ALIGN } from "@/features/admin/types/admin-table";
import { Badge } from "@/shared/components/ui/badge";
import { BUG_REPORT_STATUS, BugReportSort } from "../types/search";
import { AdminBugReportResponseDTO } from "../dto/bugReportDto";
import { Avatar } from "@/shared/components/common/Avartar";

export const adminBugReportTableColumns: Column<
  AdminBugReportResponseDTO,
  BugReportSort
>[] = [
  {
    key: "status",
    header: "상태",
    align: COLUMN_ALIGN.CENTER,
    render: (r: AdminBugReportResponseDTO) => (
      <Badge
        variant={
          r.status === BUG_REPORT_STATUS.COMPLETED ? "secondary" : "outline"
        }
      >
        {r.status === BUG_REPORT_STATUS.COMPLETED ? "해결완료" : "처리중"}
      </Badge>
    ),
    sortable: true,
  },

  {
    key: "title",
    header: "제목",
    render: (r: AdminBugReportResponseDTO) => (
      <span className="truncate font-medium">{r.title}</span>
    ),
    sortable: true,
  },

  {
    key: "user",
    header: "사용자",
    render: (r: AdminBugReportResponseDTO) => (
      <div className="flex items-center gap-1">
        <Avatar
          src={r.user?.profileImage || r.user?.image}
          name={r.user?.name}
          className="h-6 w-6"
        />
        <span className="font-medium">{`${r.user?.name ?? "-"}(${r.userEmail})`}</span>
      </div>
    ),
    sortable: true,
  },

  {
    key: "createdAt",
    header: "접수일",
    align: COLUMN_ALIGN.CENTER,
    render: (r: AdminBugReportResponseDTO) =>
      new Date(r.createdAt).toLocaleDateString("ko-KR"),
    sortable: true,
  },
] as const;
