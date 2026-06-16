import { CloudinaryFolder } from "../lib/cloudinary/cloudinary.constant";

// types/form.ts
export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "file"
  | "editor"
  | "hidden";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // select 타입일 때 사용
  folderName?: CloudinaryFolder;
}
