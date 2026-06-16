"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { uploadCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";
import { useEffect, useRef } from "react";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { CloudinaryFolder } from "@/shared/lib/cloudinary/cloudinary.constant";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  images: ImageInfo[];
  onImagesChange: (images: ImageInfo[]) => void;
  folderName: CloudinaryFolder;
}

export function RichEditor({
  value,
  onChange,
  placeholder,
  images,
  onImagesChange,
  folderName,
}: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || "내용을 입력하세요...",
      }),
      Image.configure({
        inline: true, // 이미지 나열 가능하도록 설정
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // 💡 핵심: 부모로부터 value가 전달될 때 에디터 초기화 방지
  // 이미지가 추가될 때마다 리렌더링되어 에디터가 깜빡이는 것을 막습니다.
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(value);
      editor.commands.setTextSelection({ from, to });
    }
  }, [editor, value]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editor) return;

    const fileArray = Array.from(files);

    try {
      // 모든 파일을 병렬로 업로드
      const uploadPromises = fileArray.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return await uploadCloudinaryImage(formData, folderName);
      });

      const newImagesInfo = await Promise.all(uploadPromises);

      // 각각의 이미지를 에디터에 삽입
      newImagesInfo.forEach((imageInfo) => {
        editor.chain().focus().setImage({ src: imageInfo.url }).run();
      });

      // 부모 상태 업데이트 (기존 이미지 + 새로 추가된 이미지들)
      onImagesChange([...images, ...newImagesInfo]);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      // 💡 다음 선택을 위해 input 초기화
      e.target.value = "";
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border-input min-h-75 w-full rounded-md border bg-transparent shadow-sm focus-within:ring-0">
      <div className="flex flex-wrap gap-1 border-b bg-gray-50 p-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label="B"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label="I"
        />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          label="H1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="• 목록"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded border bg-white px-3 py-1 text-sm font-medium hover:bg-gray-100"
        >
          이미지 추가
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
        />
      </div>
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 [&_.ProseMirror]:min-h-65 [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active,
  label,
}: {
  onClick: () => void;
  active: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded border px-3 py-1 text-sm font-medium ${
        active ? "bg-primary text-white" : "bg-white hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
