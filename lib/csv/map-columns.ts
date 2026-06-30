import type { ColumnMapping, MappedRow, ParsedTable, TemplateDefinition } from "./types";
import { normalizeHeader } from "./parse";

export function detectColumnMapping(
  headers: string[],
  template: TemplateDefinition
): ColumnMapping {
  const mapping: ColumnMapping = {};
  const normalizedHeaders = headers.map((header) => ({
    raw: header,
    normalized: normalizeHeader(header)
  }));

  for (const column of template.columns) {
    const aliases = [column.key, column.label, ...column.aliases].map(normalizeHeader);
    const exact = normalizedHeaders.find((header) => aliases.includes(header.normalized));
    const fuzzy =
      exact ||
      normalizedHeaders.find((header) =>
        aliases.some((alias) => header.normalized.includes(alias) || alias.includes(header.normalized))
      );
    mapping[column.key] = fuzzy?.raw || null;
  }

  return mapping;
}

export function mapRows(
  parsed: ParsedTable,
  mapping: ColumnMapping,
  template: TemplateDefinition
): MappedRow[] {
  return parsed.records.map((record) => {
    const row: MappedRow = {};
    template.columns.forEach((column) => {
      const source = mapping[column.key];
      row[column.key] = source ? String(record[source] ?? "").trim() : "";
    });
    return row;
  });
}
