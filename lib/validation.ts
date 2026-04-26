export type ValidationError = { field: string; message: string };
export type ValidationResult = { valid: boolean; errors: ValidationError[] };

function err(field: string, message: string): ValidationError {
  return { field, message };
}

export function validateMenuItem(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push(err("name", "Nome é obrigatório"));
  }

  if (!data.categoryId || typeof data.categoryId !== "string") {
    errors.push(err("categoryId", "Categoria é obrigatória"));
  }

  if (data.price === undefined || data.price === null) {
    errors.push(err("price", "Preço é obrigatório"));
  } else if (typeof data.price !== "number" || data.price < 0) {
    errors.push(err("price", "Preço deve ser um número não negativo"));
  }

  const desc = data.description as Record<string, unknown> | undefined;
  if (!desc?.pt || typeof desc.pt !== "string" || !desc.pt.trim()) {
    errors.push(err("description.pt", "Descrição em português é obrigatória"));
  }

  return { valid: errors.length === 0, errors };
}

export function validateCategory(data: Record<string, unknown>): ValidationResult {
  const errors: ValidationError[] = [];

  const name = data.name as Record<string, unknown> | undefined;
  if (!name?.pt || typeof name.pt !== "string" || !name.pt.trim()) {
    errors.push(err("name.pt", "Nome em português é obrigatório"));
  }

  if (!data.slug || typeof data.slug !== "string" || !data.slug.trim()) {
    errors.push(err("slug", "Slug é obrigatório"));
  }

  return { valid: errors.length === 0, errors };
}

/** Sanitize a user string: trim and remove control characters */
export function sanitizeString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/** Parse comma/newline separated text into a clean string array */
export function parseTagList(value: unknown): string[] {
  if (!value) return [];
  const raw = typeof value === "string" ? value : String(value);
  return raw
    .split(/[,\n]/)
    .map(s => sanitizeString(s))
    .filter(Boolean);
}
