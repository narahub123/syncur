export type ExecutionError = {
  message: string;
  code?: string;
};

export function normalizeError(error: unknown): ExecutionError {
  if (error instanceof Error) {
    const code =
      typeof (error as { code?: unknown }).code === "string"
        ? (error as { code?: string }).code
        : undefined;

    return {
      message: error.message,
      code,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  return {
    message: "UNKNOWN_ERROR",
  };
}
