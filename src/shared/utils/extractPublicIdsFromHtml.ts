export const extractPublicIdsFromHtml = (html: string): string[] => {
  if (typeof window === "undefined") return []; // 서버 환경 방어

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = Array.from(doc.querySelectorAll("img"));

  // data-public-id 속성만 모아서 반환 (null 방지)
  return images
    .map((img) => img.getAttribute("data-public-id"))
    .filter((id): id is string => id !== null && id !== "");
};
