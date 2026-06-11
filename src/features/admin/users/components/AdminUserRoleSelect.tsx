import { USER_ROLE_META, UserRole } from "@/features/users/constants/user-role";
import { UserDto } from "@/features/users/dto/userDto";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type Props = { user: UserDto; onValueChange: (role: UserRole) => void };

const AdminUserRoleSelect = ({ user, onValueChange }: Props) => {
  return (
    <Select value={user.role} onValueChange={onValueChange}>
      <SelectTrigger className="w-30">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {Object.entries(USER_ROLE_META).map(([value, meta]) => (
          <SelectItem key={value} value={value}>
            {meta.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AdminUserRoleSelect;
