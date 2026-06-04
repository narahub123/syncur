export function normalizeSiteUrl(input: string): string {
  const url = new URL(input);

  url.search = "";
  url.hash = "";

  let normalized = url.toString();

  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}
