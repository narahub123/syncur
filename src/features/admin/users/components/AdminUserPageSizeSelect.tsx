"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

import { AdminUserPageSize } from "../types";
import { ADMIN_USER_PAGE_SIZE_OPTIONS } from "../constants/adminUserPageSizeSelect";

type Props = {
  value: AdminUserPageSize;
  onChange: (value: AdminUserPageSize) => void;
};

export default function AdminUserPageSizeSelect({ value, onChange }: Props) {
  return (
    <Select
      value={String(value)}
      onValueChange={(v) => onChange(Number(v) as AdminUserPageSize)}
    >
      <SelectTrigger className="w-30">
        <SelectValue placeholder="개수" />
      </SelectTrigger>

      <SelectContent>
        {ADMIN_USER_PAGE_SIZE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
