const MAX_SLUG_LENGTH = 40;

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH);
}

export function toSchemaName(slug: string): string {
  return `tenant_${slug.replace(/-/g, '_')}`;
}
