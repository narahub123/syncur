"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useSearchCollectionsQuery } from "../collections/hooks/useSearchCollectionsQuery";
import { BOOKMARK_COLLECTION_CONFIG } from "../collections/constants/bookmark-collection-config";
import { ChangeEvent, useState } from "react";
import { useCreateCollectionAndAttachMutation } from "../collections/hooks/useCreateCollectionAndAttachMutation";

type Props = {
  open: boolean;
  onClose: () => void;
  feedItemId: string;
};

const CollectionDialog = ({ open, onClose, feedItemId }: Props) => {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    console.log(e.target.value);
  };

  const result = useSearchCollectionsQuery({
    keyword: value,
    limit: BOOKMARK_COLLECTION_CONFIG.BOOKMARK_COLLECTION_SEARCH_LIMIT,
  });

  const createMutation = useCreateCollectionAndAttachMutation();
  const handleClick = () => {
    if (!value) return;
    createMutation.mutate({ feedItemId, name: value });
  };

  console.log("결과", result.data);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>collection modal</DialogTitle>

          <DialogDescription>설명</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <input type="text" value={value} onChange={handleChange} />
          <button onClick={handleClick}>카테고리 저장하기</button>
        </div>

        <DialogFooter className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          푸터
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDialog;
