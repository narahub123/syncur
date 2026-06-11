import { UserDto } from "@/features/users/dto/userDto";
import AdminUserRoleConfirmDialog from "./AdminUserRoleConfirmDialog";
import AdminUserRoleSelect from "./AdminUserRoleSelect";
import { useState } from "react";
import { USER_ROLE_META, UserRole } from "@/features/users/constants/user-role";
import { useUpdateUserRoleMutation } from "../hooks/useUpdateUserRoleMutation";

type Props = {
  user: UserDto;
};

export function RoleCell({ user }: Props) {
  const [open, setOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);

  const handleChange = (role: UserRole) => {
    setPendingRole(role);
    setOpen(true);
  };

  const updateMutation = useUpdateUserRoleMutation();

  const hanldeConfirm = () => {
    if (!pendingRole) return;

    updateMutation.mutate({ userId: user._id, role: pendingRole });

    setOpen(false);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <AdminUserRoleSelect user={user} onValueChange={handleChange} />
      <AdminUserRoleConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="권한 변경"
        description={`${user.name}의 권한을 ${pendingRole ? USER_ROLE_META[pendingRole]["label"] : pendingRole}로 변경할까요?`}
        confirm="변경"
        onConfirm={hanldeConfirm}
      />
    </div>
  );
}
