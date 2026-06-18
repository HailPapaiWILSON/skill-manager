export function normalizarTexto(value: string): string {
  return value.trim().replace(/\s+/g, " ").normalize("NFKC");
}

export function normalizarEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizarCodigo(value: string): string {
  return value.trim().toUpperCase();
}

export function gerarCodigo(): string {
  return Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase();
}
