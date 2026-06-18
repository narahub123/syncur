import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: ReactNode; // string -> ReactNode로 변경
  icon: LucideIcon;
  desc: string;
  className?: string;
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  desc,
  className,
}: StatCardProps) => (
  <Card className={className}>
    {" "}
    {/* 카드 전체 강조를 위해 className 적용 위치 변경 */}
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="text-muted-foreground h-4 w-4" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-muted-foreground text-xs">{desc}</p>
    </CardContent>
  </Card>
);
