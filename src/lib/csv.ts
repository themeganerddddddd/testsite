export function csvEscape(value: unknown): string {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCSV(
  rows: Array<Record<string, unknown>>,
  columns: string[],
): string {
  const header = columns.map(csvEscape).join(",");
  const body = rows.map((row) =>
    columns.map((column) => csvEscape(row[column])).join(","),
  );

  return [header, ...body].join("\n");
}
