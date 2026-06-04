"use client";

type Props = {
  text?: string;
  error?: boolean;
};

export const InputHelperText = ({ text, error }: Props) => {
  if (!text) return null;

  return (
    <div
      style={{
        fontSize: "12px",
        marginTop: "6px",
        color: error ? "var(--input-error)" : "var(--input-helper-text)",
      }}
    >
      {text}
    </div>
  );
};
