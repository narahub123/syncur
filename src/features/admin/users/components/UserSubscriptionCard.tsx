import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { SubscriptionItemDto } from "@/features/subscriptions/dto/subscriptionDto";
import { PaginatedResponse } from "@/shared/types/pagination";
import { SubscriptionListDialog } from "./SubscriptionListDialog";
import { Dialog, DialogTrigger } from "@/shared/components/ui/dialog";
import Link from "next/link";
import { Avatar } from "@/shared/components/common/Avartar";

type Props = {
  subscriptions: PaginatedResponse<SubscriptionItemDto>;
};

export const UserSubscriptionCard = ({ subscriptions }: Props) => {
  const DISPLAY_LIMIT = 10;
  const items = subscriptions.items ?? [];
  const { totalCount } = subscriptions.pagination;
  const hasSubscriptions = totalCount > 0;

  return (
    <Dialog>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="font-semibold">구독 피드 ({totalCount}개)</h3>
          {hasSubscriptions && (
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                전체 보기
              </Button>
            </DialogTrigger>
          )}
        </CardHeader>
        <CardContent>
          {hasSubscriptions ? (
            <div className="flex flex-wrap gap-2">
              {items.slice(0, DISPLAY_LIMIT).map((item) => (
                <Badge variant="secondary" key={item.subscriptionId}>
                  <Link
                    className="flex items-center gap-2"
                    href={item.siteUrl}
                    target="_blank"
                  >
                    <Avatar
                      src={item.favicon_url}
                      name={item.siteName}
                      className="h-4 w-4"
                    />
                    <p>{item.siteName}</p>
                  </Link>
                </Badge>
              ))}
              {items.length > DISPLAY_LIMIT && (
                <Badge variant="outline">+{items.length - DISPLAY_LIMIT}</Badge>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              구독 중인 피드가 없습니다.
            </p>
          )}
        </CardContent>
        <SubscriptionListDialog items={items} />
      </Card>
    </Dialog>
  );
};
