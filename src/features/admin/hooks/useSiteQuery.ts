import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const useSiteQuery = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    // 페이지 1로 초기화 (필터 변경 시 첫 페이지로 이동)
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return { searchParams, setQuery };
};
