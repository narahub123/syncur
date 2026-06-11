import { UserDto } from "@/features/users/dto/userDto";
import { AdminUserSort } from "../types";

export type UserTableColumn = {
  key: AdminUserSort;
  header: string;
  render: (user: UserDto) => React.ReactNode;
};

export const userTableColumns: UserTableColumn[] = [
  {
    key: "name",
    header: "이름",
    render: (user) => user.name ?? "-",
  },
  {
    key: "email",
    header: "이메일",
    render: (user) => user.email,
  },
  {
    key: "role",
    header: "권한",
    render: (user) => (
      <span
        className={
          user.role === "admin" ? "font-medium text-red-500" : "text-gray-600"
        }
      >
        {user.role}
      </span>
    ),
  },
  {
    key: "onboarding",
    header: "온보딩",
    render: (user) => (user.onboardingCompleted ? "완료" : "미완료"),
  },
  {
    key: "createdAt",
    header: "가입일",
    render: (user) => new Date(user.createdAt).toLocaleDateString(),
  },
];
