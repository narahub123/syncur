import { Column, COLUMN_ALIGN } from "@/features/admin/types/admin-table";
import { AdminUserSort } from "../types/search";
import { RoleCell } from "../components/AdminUserRoleCell";
import { Avatar } from "@/shared/components/common/Avartar";
import { UserDto } from "@/features/users/dto/userDto";

export const adminUserTableColumns: Column<UserDto, AdminUserSort>[] = [
  {
    key: "name",
    header: "이름",
    sortable: true,
    render: (u: UserDto) => (
      <div className="flex items-center gap-1">
        <Avatar
          src={u.profileImage || u.image}
          name={u.name}
          className="h-6 w-6"
        />
        <span className="font-medium">{u.name ?? "-"}</span>
      </div>
    ),
  },

  {
    key: "email",
    header: "이메일",
    sortable: true,
    render: (u: UserDto) => <span className="font-medium">{u.email}</span>,
  },

  {
    key: "role",
    header: "권한",
    sortable: true,
    render: (u: UserDto) => <RoleCell user={u} />,
  },

  {
    key: "onboarding",
    header: "온보딩",
    sortable: true,
    render: (u: UserDto) => (u.onboardingCompleted ? "완료" : "미완료"),
  },

  {
    key: "createdAt",
    header: "가입일",
    align: COLUMN_ALIGN.CENTER,
    sortable: true,
    render: (u: UserDto) => new Date(u.createdAt).toLocaleDateString("ko-KR"),
  },
] as const;
