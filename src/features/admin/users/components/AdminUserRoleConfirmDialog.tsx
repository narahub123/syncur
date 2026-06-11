import ConfirmDialog from "@/shared/components/common/ConfirmDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirm?: string;
  cancel?: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
};

const AdminUserRoleConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirm,
  onConfirm,
}: Props) => {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirm={confirm}
      onConfirm={onConfirm}
    />
  );
};

export default AdminUserRoleConfirmDialog;
