export function normalizeInputUrl(input: string): string {
  if (!input.startsWith("http://") && !input.startsWith("https://")) {
    return `https://${input}`;
  }
  return input;
}
