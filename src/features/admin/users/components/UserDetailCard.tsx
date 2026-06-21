import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import AdminUserRoleSelect from "./AdminUserRoleSelect";
import { Avatar } from "@/shared/components/common/Avartar";
import { Badge } from "@/shared/components/ui/badge";
import { UserDto } from "@/features/users/dto/userDto";
import { UserRole } from "@/features/users/constants/user-role";

type Props = {
  user: UserDto;
  onRoleChange: (newRole: UserRole) => void;
};

export const UserDetailCard = ({ user, onRoleChange }: Props) => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={user.profileImage?.url || user.image}
            name={user.name}
            className="h-16 w-16"
          />
          <div>
            <h2 className="text-xl font-bold">{user.name || "이름 없음"}</h2>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
        <AdminUserRoleSelect user={user} onValueChange={onRoleChange} />
      </CardHeader>

      <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-muted-foreground">ID</p>
          <p className="font-mono break-all">{user._id}</p>
        </div>
        <div></div>

        <div className="space-y-1">
          <p className="text-muted-foreground">가입일</p>
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground">마지막 활동</p>
          <p>
            {user.lastActiveAt
              ? new Date(user.lastActiveAt).toLocaleString()
              : "기록 없음"}
          </p>
        </div>

        {/* 빈 div를 제거하여 레이아웃을 정렬했습니다 */}
        <div className="space-y-1">
          <p className="text-muted-foreground">이메일 인증</p>
          <Badge variant={user.emailVerified ? "default" : "outline"}>
            {user.emailVerified ? "인증됨" : "미인증"}
          </Badge>
        </div>

        <div className="space-y-1">
          <p className="text-muted-foreground">온보딩 상태</p>
          <Badge variant={user.onboardingCompleted ? "default" : "secondary"}>
            {user.onboardingCompleted ? "완료" : "미완료"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
