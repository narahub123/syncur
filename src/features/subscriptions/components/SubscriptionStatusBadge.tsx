import { cn } from "@/shared/utils/cn";
import { SUBSCRIPTION_STATUS_UI as STATUS_UI } from "../constants/subscription-status-badge";
import { SubscriptionStatus } from "../domain/getSiteStatus";

type Props = {
  status: SubscriptionStatus;
};

export const SubscriptionStatusBadge = ({ status }: Props) => {
  const ui = STATUS_UI[status];
  const Icon = ui.icon;

  return (
    <span
      aria-hidden="true"
      title={ui.text}
      className={cn("flex items-center gap-1 text-xs", ui.className)}
    >
      <span>{ui.text}</span>
      <Icon size={12} className="flex items-center justify-center" />
    </span>
  );
};
