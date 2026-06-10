export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ").normalize("NFKC");
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeCode(value: string): string {
  return value.trim().toUpperCase();
}

export function generateCode(): string {
  return Math.random()
    .toString(36)
    .slice(2, 8)
    .toLowerCase();
}
