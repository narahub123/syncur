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
import { Avatar } from "@/shared/components/common/Avartar";

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
      setTempPublicId(publicId);
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
      console.error("이미지 업로드 실패", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = async () => {
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
      <section className="flex w-full items-end gap-4">
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold">프로필 수정</h2>
          <div className="flex items-center gap-6">
            <div className="relative h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-50">
              <Avatar
                src={user.profileImage?.url || user.image}
                name={user.name}
                className="h-full w-full"
              />
              <button
                type="button"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-xs text-white opacity-0 transition-opacity hover:opacity-100"
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
            <div className="flex-1 space-y-1">
              <input
                {...register("name")}
                className="text-md w-full rounded border bg-transparent px-1 transition-all outline-none hover:border-gray-300 focus:border-gray-400 focus:bg-white"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
              <div className="px-1 text-sm text-gray-500">{user.email}</div>
            </div>
          </div>
        </div>
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
      </section>
    </form>
  );
}
