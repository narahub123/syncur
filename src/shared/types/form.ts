// types/form.ts
export type FieldType = "text" | "textarea" | "select" | "file" | "editor";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // select 타입일 때 사용
}
