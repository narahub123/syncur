"use client";

import { FEED_STATUS_OPTIONS } from "@/features/feeds/constants/feed-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FeedStatus } from "@/shared/types/feed";

type Props = {
  value: FeedStatus;
  onChange: (value: FeedStatus) => void;
  disabled?: boolean;
};

export default function FeedStatusSelect({ value, onChange, disabled }: Props) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-20">
        <SelectValue />
      </SelectTrigger>

      <SelectContent className="min-w-20">
        {FEED_STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="w-20">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
