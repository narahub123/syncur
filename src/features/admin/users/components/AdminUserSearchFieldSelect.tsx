"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";

import { AdminUserSearchField } from "../types";
import { ADMIN_USER_SEARCH_FIELD_OPTIONS } from "../constants/adminUserSearchSelect";

type Props = {
  value: AdminUserSearchField;
  onChange: (value: AdminUserSearchField) => void;
};

export default function AdminUserSearchFieldSelect({ value, onChange }: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as AdminUserSearchField)}
    >
      <SelectTrigger className="w-30">
        <SelectValue placeholder="필드" />
      </SelectTrigger>

      <SelectContent>
        {ADMIN_USER_SEARCH_FIELD_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
