"use server";

import cloudinary from "./cloudinary";
import { CloudinaryFolder } from "./cloudinary.constant";
import { ImageInfo } from "./image-info.model";

/**
 * 이미지 업로드 액션
 * @param formData 업로드할 파일이 포함된 FormData
 * @param folderName Cloudinary 내 저장할 폴더 경로 (상수 기반)
 * @returns 업로드된 이미지의 URL과 publicId
 */
export async function uploadCloudinaryImage(
  formData: FormData,
  folderName: CloudinaryFolder,
): Promise<ImageInfo> {
  const file = formData.get("file") as File;
  if (!file) throw new Error("파일이 없습니다.");

  // 파일 데이터를 Buffer로 변환
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    // 💡 folderName 대신 folder 속성명을 사용해야 합니다.
    cloudinary.uploader
      .upload_stream({ folder: folderName }, (error, result) => {
        if (error) return reject(error);

        // 성공 시 데이터 반환
        resolve({
          url: result?.secure_url as string,
          publicId: result?.public_id as string,
        });
      })
      .end(buffer);
  });
}

/**
 * 이미지 삭제 액션
 * @param publicId 삭제할 이미지의 고유 ID
 * @returns 삭제 결과 객체
 */
export async function deleteCloudinaryImage(publicId: string) {
  try {
    // Cloudinary의 destroy 메서드를 통해 리소스 삭제
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("이미지 삭제 실패:", error);
    throw new Error("이미지 삭제에 실패했습니다.");
  }
}
