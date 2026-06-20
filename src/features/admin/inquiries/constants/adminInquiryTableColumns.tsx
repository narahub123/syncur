import { Column, COLUMN_ALIGN } from "@/features/admin/types/admin-table";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar } from "@/shared/components/common/Avartar";
import { INQUIRY_STATUS, InquirySort } from "../types/search";
import { AdminInquiryResponseDTO } from "../dto/inquiryDto";

export const adminInquiryTableColumns: Column<
  AdminInquiryResponseDTO,
  InquirySort
>[] = [
  {
    key: "status",
    header: "상태",
    align: COLUMN_ALIGN.CENTER,
    render: (r: AdminInquiryResponseDTO) => (
      <Badge
        variant={
          r.status === INQUIRY_STATUS.COMPLETED ? "secondary" : "outline"
        }
      >
        {r.status === INQUIRY_STATUS.COMPLETED ? "답변완료" : "처리중"}
      </Badge>
    ),
    sortable: true,
  },

  {
    key: "title",
    header: "제목",
    render: (r: AdminInquiryResponseDTO) => (
      <span className="truncate font-medium">{r.title}</span>
    ),
    sortable: true,
  },

  {
    key: "user",
    header: "사용자",
    render: (r: AdminInquiryResponseDTO) => (
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
    header: "문의일",
    align: COLUMN_ALIGN.CENTER,
    render: (r: AdminInquiryResponseDTO) =>
      new Date(r.createdAt).toLocaleDateString("ko-KR"),
    sortable: true,
  },
] as const;
