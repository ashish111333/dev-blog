export function formatDate(input: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium"
  }).format(typeof input === "string" ? new Date(input) : input);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
