"use client";

import { useState } from "react";
import { UserRole } from "@/features/users/constants/user-role";
import AdminUserRoleConfirmDialog from "./AdminUserRoleConfirmDialog";
import { useUserById } from "../hooks/useUserById";
import { useUpdateUserRoleMutation } from "../hooks/useUpdateUserRoleMutation";
import { UserDetailCard } from "./UserDetailCard";
import { UserSubscriptionCard } from "./UserSubscriptionCard";
import { toast } from "sonner";
import { UserActivityCard } from "./UserActivityCard";

interface Props {
  userId: string;
}

const AdminUserClient = ({ userId }: Props) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading } = useUserById(userId);

  const { mutate: updateRole } = useUpdateUserRoleMutation();

  if (isLoading || !data) return <div>로딩 중...</div>;

  const { user, subscriptions, activity } = data;

  // 1. 셀렉트 박스에서 값 변경 시
  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setIsDialogOpen(true); // 확인 창 띄우기
  };

  // 2. 확인 창에서 확정 시 (실제 서버 액션 호출)
  const handleConfirm = async () => {
    if (!selectedRole) return;

    try {
      // 1. 서버 액션 호출 (비동기 처리를 위해 await 추가)
      await updateRole({ userId, role: selectedRole });

      // 2. 성공 메시지
      toast.success("권한 변경 완료", {
        description: `${user?.name}님의 권한이 ${selectedRole}(으)로 성공적으로 변경되었습니다.`,
      });

      setIsDialogOpen(false);
    } catch (error) {
      // 3. 실패 메시지
      console.error("권한 변경 실패", error);

      toast.error("권한 변경 실패", {
        description: "권한 변경 중 문제가 발생했습니다. 다시 시도해 주세요.",
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="mb-6 text-xl font-bold">사용자 상세 정보</h1>
      <UserDetailCard user={user} onRoleChange={handleRoleChange} />
      <UserSubscriptionCard subscriptions={subscriptions} />
      <UserActivityCard activity={activity}/>
      <AdminUserRoleConfirmDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="권한 변경 확인"
        description={`${user.name}님의 권한을 '${selectedRole}'로 변경하시겠습니까?`}
        confirm="변경하기"
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default AdminUserClient;
