import { Check, Circle, X } from "lucide-react";

export const SUBSCRIPTION_STATUS_UI = {
  available: {
    text: "구독 가능",
    icon: Circle,
    className: "text-blue-400",
  },
  subscribed: {
    text: "구독중",
    icon: Check,
    className: "text-green-400",
  },
  not_supported: {
    text: "구독 불가",
    icon: X,
    className: "text-red-400",
  },
} as const;
