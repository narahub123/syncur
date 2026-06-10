"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useEffect, useState } from "react";
import { useCreateCollectionAndAttachMutation } from "../hooks/useCreateCollectionAndAttachMutation";
import { useCollectionDialogStore } from "../../stores/useCollectionDialogStore";
import { Button } from "@/shared/components/ui/button";
import CollectionInput from "./CollectionInput";
import { useReplaceBookmarkCollectionMutation } from "../hooks/useReplaceBookmarkCollectionMutation";
import { useRenameCollectionMutation } from "../hooks/useRenameCollectionMutation";
import { LoaderCircle } from "lucide-react";
import { useRemoveBookmarkCollectionMapMutation } from "../../collection-map/hooks/useRemoveBookmarkCollectionMapMutation";

const CollectionDialog = () => {
  const { isOpen, closeDialog, feedItemId, collection } =
    useCollectionDialogStore((c) => c);

  const [value, setValue] = useState(collection?.collectionName ?? "");
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | undefined
  >(collection?.collectionId);

  const createMutation = useCreateCollectionAndAttachMutation();

  const renameMutation = useRenameCollectionMutation();

  const replaceMutation = useReplaceBookmarkCollectionMutation();

  const isPending =
    createMutation.isPending ||
    renameMutation.isPending ||
    replaceMutation.isPending;

  const deleteMutation = useRemoveBookmarkCollectionMapMutation();

  const handleClick = () => {
    if (!feedItemId || !value.trim()) {
      return;
    }

    /**
     * 신규 생성
     */
    if (!collection) {
      createMutation.mutate({
        feedItemId,
        name: value.trim(),
      });

      return;
    }

    /**
     * 변경 없음
     */
    if (
      selectedCollectionId === collection.collectionId &&
      value.trim() === collection.collectionName
    ) {
      return;
    }

    console.log({
      value,
      selectedCollectionId,
      currentCollection: collection,
    });

    /**
     * 이름 변경
     */
    if (!selectedCollectionId && value.trim() !== collection.collectionName) {
      renameMutation.mutate({
        collectionId: collection.collectionId,
        name: value.trim(),
        feedItemId,
      });

      return;
    }

    /**
     * 컬렉션 이동
     *
     * - 기존 컬렉션 선택
     * - 새 컬렉션 생성 후 이동
     */
    replaceMutation.mutate({
      feedItemId,
      currentCollectionId: collection.collectionId,
      nextCollectionId: selectedCollectionId,
      nextCollectionName: value.trim(),
    });
  };

  const handleDeleteClick = () => {
    if (!collection || !feedItemId) return;
    const collectionId = collection.collectionId;

    deleteMutation.mutate({ collectionId, feedItemId });

    setValue("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>컬렉션 관리</DialogTitle>

          <DialogDescription>
            이 피드 아이템의 컬렉션을 추가, 변경 또는 제거할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 gap-2 overflow-y-auto">
          <CollectionInput
            value={value}
            onValueChange={(value) => {
              setValue(value);
              setSelectedCollectionId(undefined);
            }}
            onSelectCollection={(collectionId, collectionName) => {
              setSelectedCollectionId(collectionId);
              setValue(collectionName);
            }}
          />
          <Button onClick={handleClick} className="shrink-0">
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : collection ? (
              "수정"
            ) : (
              "저장"
            )}
          </Button>
          <Button onClick={handleDeleteClick}>
            {deleteMutation.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "제거"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionDialog;
