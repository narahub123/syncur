import { Card, CardContent } from "@/shared/components/ui/card";

interface AccountCardProps {
  children: React.ReactNode;
}

export function SettingsCard({ children }: AccountCardProps) {
  return (
    <Card className="m-6 overflow-hidden shadow">
      <CardContent className="px-6 py-2">{children}</CardContent>
    </Card>
  );
}
