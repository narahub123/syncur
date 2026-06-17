"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserDto } from "@/features/users/dto/userDto";
import { Button } from "@/shared/components/ui/button";
import {
  uploadCloudinaryImage,
  deleteCloudinaryImage,
} from "@/shared/lib/cloudinary/cloudinary.utils";
import { CLOUDINARY_FOLDERS } from "@/shared/lib/cloudinary/cloudinary.constant";
import { useUpdateProfile } from "@/features/users/hooks/useUpdateProfile";
import UserAvatar from "@/features/users/components/UserAvatar";

const profileSchema = z.object({
  name: z.string().min(1, "이름은 필수입니다."),
  profileImage: z
    .object({
      url: z.string().url(),
      publicId: z.string(),
    })
    .nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Props {
  user: UserDto;
  onCancel: () => void;
}

export function ProfileEditForm({ user, onCancel }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  // 취소 시 삭제할 임시 이미지의 publicId 관리
  const [tempPublicId, setTempPublicId] = useState<string | null>(null);

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || "",
      profileImage: user.profileImage
        ? { url: user.profileImage.url, publicId: user.profileImage.publicId }
        : null,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const { url, publicId } = await uploadCloudinaryImage(
        formData,
        CLOUDINARY_FOLDERS.PROFILES,
      );

      setValue("profileImage", { url, publicId });
      setTempPublicId(publicId); // 업로드 성공 시 ID 저장
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
      console.error("이미지 업로드 실패", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = async () => {
    // 취소 시 방금 올린 임시 이미지가 있다면 서버에서 즉시 삭제
    if (tempPublicId) {
      try {
        await deleteCloudinaryImage(tempPublicId);
      } catch (error) {
        console.error("임시 이미지 정리 실패:", error);
      }
    }
    onCancel();
  };

  const onSubmit = async (data: ProfileFormValues) => {
    // 폼 데이터에는 name과 image(객체)가 들어있습니다.
    updateProfile(
      {
        name: data.name,
        profileImage: data.profileImage,
      },
      {
        onSuccess: () => {
          onCancel();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h2 className="mb-4 text-lg font-semibold">프로필 정보</h2>
      <div className="flex w-full items-end">
        {/* 1. 이미지 섹션 */}
        <div className="flex flex-1 gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
              <UserAvatar
                src={user.image}
                profileImage={user.profileImage}
                className="h-full w-full"
              />
              {/* 오버레이 버튼: 사진 변경을 더 자연스럽게 */}
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-xs text-white opacity-0 transition-opacity hover:opacity-100"
                onClick={() => fileInputRef.current?.click()}
              >
                변경
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* 2. 정보 섹션 */}
          <div className="flex-1 space-y-1">
            <input
              {...register("name")}
              className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-lg font-semibold transition-all outline-none hover:border-gray-300 focus:border-gray-400 focus:bg-white"
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
            <div className="px-1 text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
        {/* 3. 버튼 섹션 */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCancel}
          >
            취소
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isUploading || isPending || !isDirty}
          >
            저장
          </Button>
        </div>
      </div>
    </form>
  );
}
