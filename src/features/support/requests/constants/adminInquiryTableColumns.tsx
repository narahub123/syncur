import {
  AdminRequestResponseDTO,
  AdminRequestSort,
} from "../types/admin-search";
import { Badge } from "@/shared/components/ui/badge"; // Shadcn UI Badge 활용
import { REQUEST_STATUS, REQUEST_TYPE } from "./request-type";

export const adminInquiryTableColumns: {
  key: AdminRequestSort;
  header: string;
  render: (r: AdminRequestResponseDTO) => React.ReactNode;
}[] = [
  {
    key: "type",
    header: "유형",
    render: (r) => (
      <Badge
        variant={r.type === REQUEST_TYPE.BUG_REPORT ? "destructive" : "default"}
      >
        {r.type}
      </Badge>
    ),
  },
  { key: "title", header: "제목", render: (r) => r.title },
  {
    key: "status",
    header: "상태",
    render: (r) => (
      <Badge
        variant={
          r.status === REQUEST_STATUS.COMPLETED ? "secondary" : "outline"
        }
      >
        {r.status === REQUEST_STATUS.COMPLETED ? "답변완료" : "처리중"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    header: "문의일",
    render: (r) => new Date(r.createdAt).toLocaleDateString(),
  },
];
