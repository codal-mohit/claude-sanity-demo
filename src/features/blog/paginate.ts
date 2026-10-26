export const PAGE_SIZE = 9;

export type Pagination = { page: number; totalPages: number; start: number; end: number };

// Parses the ?page= value and returns GROQ slice bounds, clamped to the available pages.
export function paginate(pageParam: string | null | undefined, total: number, pageSize = PAGE_SIZE): Pagination {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requested = Number.parseInt(pageParam ?? '1', 10);
  const page = Number.isFinite(requested) ? Math.min(Math.max(requested, 1), totalPages) : 1;
  const start = (page - 1) * pageSize;
  return { page, totalPages, start, end: start + pageSize };
}
