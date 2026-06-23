import { Column, COLUMN_ALIGN } from "@/features/admin/types/admin-table";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar } from "@/shared/components/common/Avartar";
import { InquirySort, InquiryStatus } from "../types/search";
import { AdminInquiryResponseDTO } from "../dto/inquiryDto";

/**
 * 🎨 Inquiry 전용 배지 스타일 매핑
 */
const INQUIRY_BADGE_STYLE: Record<
  InquiryStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "대기중",
    className: "bg-slate-100 text-slate-700 border-slate-200",
  },
  PROCESSING: {
    label: "처리중",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  COMPLETED: {
    label: "답변완료",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export const adminInquiryTableColumns: Column<
  AdminInquiryResponseDTO,
  InquirySort
>[] = [
  {
    key: "status",
    header: "상태",
    align: COLUMN_ALIGN.CENTER,
    render: (r: AdminInquiryResponseDTO) => {
      const badgeStyle = INQUIRY_BADGE_STYLE[r.status];
      return (
        <Badge variant="outline" className={badgeStyle.className}>
          {badgeStyle.label}
        </Badge>
      );
    },
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
