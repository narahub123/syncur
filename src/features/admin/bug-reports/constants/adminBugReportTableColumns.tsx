import { Column, COLUMN_ALIGN } from "@/features/admin/types/admin-table";
import { Badge } from "@/shared/components/ui/badge";
import { BugReportSort, BugReportStatus } from "../types/search";
import { AdminBugReportResponseDTO } from "../dto/bugReportDto";
import { Avatar } from "@/shared/components/common/Avartar";

/**
 * 🎨 프론트엔드 컴포넌트 내부 혹은 파일 상단에 선언할 Badge 매핑 데이터
 * 각 상태에 맞는 배리언트(variant)와 출력할 라벨을 격리합니다.
 */
const BUG_BADGE_CONFIG: Record<
  BugReportStatus,
  {
    label: string;
    variant: "default" | "secondary" | "outline" | "destructive";
  }
> = {
  PENDING: { label: "접수대기", variant: "destructive" },
  CHECKING: { label: "확인중", variant: "secondary" }, // 혹은 프로젝트 테마에 맞춘 배리언트
  FIXING: { label: "수정중", variant: "secondary" }, // 중요도나 경고 의미를 줄 때
  COMPLETED: { label: "해결완료", variant: "default" },
};

export const adminBugReportTableColumns: Column<
  AdminBugReportResponseDTO,
  BugReportSort
>[] = [
  {
    key: "status",
    header: "상태",
    align: COLUMN_ALIGN.CENTER,
    render: (r: AdminBugReportResponseDTO) => {
      const badgeConfig = BUG_BADGE_CONFIG[r.status] || {
        label: "알수없음",
        variant: "outline",
      };
      return <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>;
    },
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
