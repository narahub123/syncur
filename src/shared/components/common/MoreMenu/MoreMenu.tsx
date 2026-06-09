import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";
import { FeedMoreMenuAction } from "./types";

type Props = {
  actions: FeedMoreMenuAction[];
};

export const MoreMenu = ({ actions }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="hover:bg-accent rounded-full p-1"
          title="더보기 열기"
        >
          <MoreVertical size={20} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent sideOffset={6} align="end">
        {actions.map((action, idx) => {
          const isSeparator = action.type === "separator";

          if (isSeparator) {
            return <DropdownMenuSeparator key={idx} />;
          }

          return (
            <DropdownMenuItem
              key={action.type + idx}
              onClick={action.onClick}
              variant={action.variant}
            >
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
