import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <LoaderCircle className="size-8 animate-spin" aria-hidden="true" />

        <p
          role="status"
          aria-live="polite"
          className="text-muted-foreground text-sm"
        >
          로딩 중...
        </p>
      </div>
    </div>
  );
}
