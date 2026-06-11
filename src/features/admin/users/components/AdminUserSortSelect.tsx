"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

import { AdminUserSort } from "../types";
import { ADMIN_USER_SORT_OPTIONS } from "../constants/adminUserSortSelect";

type Props = {
  value: AdminUserSort;
  onChange: (value: AdminUserSort) => void;
};

export default function AdminUserSortSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as AdminUserSort)}>
      <SelectTrigger className="w-35">
        <SelectValue placeholder="정렬" />
      </SelectTrigger>

      <SelectContent>
        {ADMIN_USER_SORT_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
