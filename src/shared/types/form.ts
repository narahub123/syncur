import { CloudinaryFolder } from "../lib/cloudinary/cloudinary.constant";

// types/form.ts
export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "file"
  | "editor"
  | "hidden";

export type FormFieldOptionType = {
  label: string;
  value: string;
};

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: FormFieldOptionType[]; // select 타입일 때 사용
  folderName?: CloudinaryFolder;
  isMultiple?: boolean;
}
