"use client";

import { Input } from "@/shared/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function AdminUserSearchInput({ value, onChange }: Props) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="사용자 검색"
      className="w-55"
    />
  );
}
