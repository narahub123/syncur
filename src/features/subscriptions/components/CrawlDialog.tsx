"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { LoaderCircle } from "lucide-react";
import { useSiteSubscriptionStore } from "../store/siteSubscriptionStore";
import { useListingPages } from "@/features/feeds/hooks/useListingPagesQuery";
import { useSubscribeManyMutation } from "../hooks/useSubscribeManyMutation";
import { toast } from "sonner";

export type ListingPageDto = {
  feedId: string;
  title: string;
  url: string;
  isSubscribed: boolean;
};

type CrawlDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CrawlDialog({ open, onOpenChange }: CrawlDialogProps) {
  const selectedSite = useSiteSubscriptionStore((s) => s.selectedSite);
  const siteId = selectedSite?.siteId;
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  console.log("사이트 아이디", siteId);
  const { data: pages, isLoading } = useListingPages(siteId);
  const { mutate: subscribeMany, isPending } = useSubscribeManyMutation();

  // =========================
  // toggle select
  // =========================
  const toggle = (feedId: string, disabled: boolean) => {
    if (disabled) return;

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(feedId)) next.delete(feedId);
      else next.add(feedId);
      return next;
    });
  };

  // =========================
  // confirm
  // =========================
  const handleConfirm = () => {
    if (!siteId) return;

    subscribeMany(Array.from(selected), {
      onSuccess: () => {
        setSelected(new Set());
        onOpenChange(false);
        toast.success("구독이 완료되었습니다");
      },
      onError: () => {
        toast.error("구독 처리에 실패했습니다");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-dvh w-screen flex-col sm:h-[85vh] sm:w-[90vw] sm:max-w-3xl sm:rounded-lg">
        {/* =========================
            HEADER
        ========================= */}
        <DialogHeader>
          <DialogTitle>구독 가능한 목록 선택</DialogTitle>
        </DialogHeader>

        {/* =========================
            BODY
        ========================= */}
        <div className="flex-1 space-y-2 overflow-y-auto py-2">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <LoaderCircle className="h-5 w-5 animate-spin" />
            </div>
          )}

          {!isLoading &&
            pages?.map((page) => {
              const isDisabled = page.isSubscribed;
              const isChecked = selected.has(page.feedId) || page.isSubscribed;

              return (
                <label
                  key={page.feedId}
                  className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                    isDisabled ? "cursor-not-allowed opacity-60" : ""
                  }`}
                >
                  <Checkbox
                    checked={isChecked}
                    disabled={isDisabled}
                    onCheckedChange={() => toggle(page.feedId, isDisabled)}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {page.title}
                    </div>

                    <div className="truncate text-xs text-gray-500">
                      {page.url}
                    </div>

                    {page.isSubscribed && (
                      <div className="mt-1 text-xs text-green-600">
                        이미 구독 중
                      </div>
                    )}
                  </div>
                </label>
              );
            })}

          {!isLoading && pages?.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              선택 가능한 목록이 없습니다
            </div>
          )}
        </div>

        {/* =========================
            FOOTER
        ========================= */}
        <DialogFooter className="shrink-0">
          <Button
            disabled={selected.size === 0 || isPending}
            onClick={handleConfirm}
          >
            {isPending ? "처리 중..." : `선택 완료 (${selected.size})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
