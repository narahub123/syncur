import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SubscriptionItemDto } from "@/features/subscriptions/dto/subscriptionDto";
import { Avatar } from "@/shared/components/common/Avartar";
import Link from "next/link";

export const SubscriptionListDialog = ({
  items,
}: {
  items: SubscriptionItemDto[];
}) => {
  return (
    <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-125">
      <DialogHeader>
        <DialogTitle>구독 중인 피드 전체 목록</DialogTitle>
      </DialogHeader>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>사이트명</TableHead>
            <TableHead>구독일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.subscriptionId}>
              <TableCell className="font-medium">
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
              </TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DialogContent>
  );
};
