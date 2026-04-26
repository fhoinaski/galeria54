import { env } from "./env";

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; error: string };

export function validateImageFile(file: File): ImageValidationResult {
  const allowedTypes = env.imageAllowedTypes;
  const maxBytes = env.imageMaxSizeMb * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return {
      ok: false,
      error: `Tipo não permitido. Use: ${allowedTypes.join(", ")}`,
    };
  }

  if (file.size > maxBytes) {
    return {
      ok: false,
      error: `Arquivo muito grande. Máximo: ${env.imageMaxSizeMb} MB`,
    };
  }

  return { ok: true };
}

/** Returns true if the string looks like a valid absolute URL */
export function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
