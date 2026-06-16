import { X } from "lucide-react"; // lucide-react 아이콘 추천
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { deleteCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";

interface ImagePreviewProps {
  images: ImageInfo[];
  onDelete: (newImages: ImageInfo[]) => void;
}

export function ImagePreview({ images, onDelete }: ImagePreviewProps) {
  const handleDelete = async (publicId: string) => {
    try {
      await deleteCloudinaryImage(publicId);
      onDelete(images.filter((img) => img.publicId !== publicId));
    } catch (error) {
      console.error("이미지 삭제 중 오류:", error);
    }
  };

  if (images.length === 0) return <div>이미지 없음</div>; // 이게 나오는지 확인

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {images.map((img) => (
        <div key={img.publicId} className="group relative h-24 w-24">
          <img
            src={img.url}
            alt="미리보기"
            className="h-full w-full rounded-md border object-cover"
          />
          <button
            type="button"
            onClick={() => handleDelete(img.publicId)}
            className="bg-destructive absolute -top-2 -right-2 rounded-full p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
