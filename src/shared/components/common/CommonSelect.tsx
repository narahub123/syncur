import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Props {
  options: readonly { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const CommonSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: Props) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="h-8 max-w-30 min-w-20 py-0 text-xs">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent side="right" align="start">
      <SelectItem value="all">전체</SelectItem>
      {options.map((opt) => (
        <SelectItem key={opt.value} value={opt.value}>
          {opt.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
