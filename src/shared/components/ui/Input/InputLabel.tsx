"use client";

type Props = {
  label?: string;
  required?: boolean;
  htmlFor?: string;
};

export const InputLabel = ({ label, required, htmlFor }: Props) => {
  if (!label) return null;

  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: "13px",
        color: "var(--foreground)",
        marginBottom: "6px",
        display: "block",
      }}
    >
      {label}
      {required && <span style={{ color: "var(--input-error)" }}> *</span>}
    </label>
  );
};
