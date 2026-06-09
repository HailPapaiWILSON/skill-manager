export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ").normalize("NFKC");
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}
