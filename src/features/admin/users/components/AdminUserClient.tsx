"use client";

import { useState } from "react";
import { UserRole } from "@/features/users/constants/user-role";
import AdminUserRoleSelect from "./AdminUserRoleSelect";
import AdminUserRoleConfirmDialog from "./AdminUserRoleConfirmDialog";
import { useUserById } from "../hooks/useUserById";
import { useUpdateUserRoleMutation } from "../hooks/useUpdateUserRoleMutation";
import { Avatar } from "@/shared/components/common/Avartar";

interface Props {
  userId: string;
}

const AdminUserClient = ({ userId }: Props) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: user, isLoading } = useUserById(userId);
  const { mutate: updateRole } = useUpdateUserRoleMutation();

  // 1. 셀렉트 박스에서 값 변경 시
  const handleRoleChange = (newRole: UserRole) => {
    setSelectedRole(newRole);
    setIsDialogOpen(true); // 확인 창 띄우기
  };

  // 2. 확인 창에서 확정 시 (실제 서버 액션 호출)
  const handleConfirm = async () => {
    if (!selectedRole) return;

    try {
      // 여기에 updateUserRoleAction(user.id, selectedRole) 같은 서버 액션 호출
      updateRole({ userId, role: selectedRole });
      console.log(`${user?.name}의 권한을 ${selectedRole}(으)로 변경 요청`);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("권한 변경 실패", error);
    }
  };

  if (isLoading || !user) return <div>로딩 중...</div>;
  return (
    <div className="max-w-2xl p-6">
      <h1 className="mb-6 text-xl font-bold">사용자 상세 정보</h1>

      <div className="flex items-center gap-6 rounded-lg border p-4">
        <Avatar
          src={user.profileImage || user.image}
          name={user.name}
          className="h-20 w-20"
        />

        <div className="flex-1">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="mt-1 text-xs text-gray-400">ID: {user._id}</p>
        </div>

        <div className="text-right">
          <label className="mb-1 block text-sm text-gray-600">
            사용자 권한
          </label>
          <AdminUserRoleSelect user={user} onValueChange={handleRoleChange} />
        </div>
      </div>

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
