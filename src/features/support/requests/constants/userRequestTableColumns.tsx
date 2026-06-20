import { RequestResponseDTO } from "../dtos";
import { REQUEST_STATUS, REQUEST_TYPE } from "../constants/request-type";
import { Column, COLUMN_ALIGN } from "@/features/admin/types/admin-table";
import { UserRequestSort } from "../types/search";
import { Badge } from "@/shared/components/ui/badge";

export const userRequestTableColumns: Column<
  RequestResponseDTO,
  UserRequestSort
>[] = [
  {
    key: "status",
    header: "상태",
    align: COLUMN_ALIGN.CENTER,
    render: (r: RequestResponseDTO) => (
      <Badge
        variant={
          r.status === REQUEST_STATUS.COMPLETED ? "secondary" : "outline"
        }
      >
        {r.status === REQUEST_STATUS.COMPLETED ? "답변완료" : "처리중"}
      </Badge>
    ),
    sortable: true,
  },

  {
    key: "type",
    header: "유형",
    align: COLUMN_ALIGN.CENTER,
    render: (r: RequestResponseDTO) => (
      <span
        className={`text-xs font-semibold ${
          r.type === REQUEST_TYPE.BUG_REPORT ? "text-red-600" : "text-blue-600"
        }`}
      >
        {r.type === REQUEST_TYPE.BUG_REPORT ? "버그" : "문의"}
      </span>
    ),
    sortable: true,
  },

  {
    key: "title",
    header: "제목",
    render: (r: RequestResponseDTO) => (
      <span className="truncate font-medium">{r.title}</span>
    ),
    sortable: true,
  },

  {
    key: "createdAt",
    header: "접수일",
    align: COLUMN_ALIGN.CENTER,
    render: (r: RequestResponseDTO) =>
      new Date(r.createdAt).toLocaleDateString("ko-KR"),
    sortable: true,
  },
] as const;
