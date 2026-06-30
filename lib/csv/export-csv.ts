import type { NormalizedRow, TemplateDefinition } from "./types";

export function exportStandardCsv(rows: NormalizedRow[], template: TemplateDefinition): string {
  const headers = template.columns.map((column) => column.key);
  const labels = template.columns.map((column) => column.label);
  const lines = [labels.map(escapeCell).join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escapeCell(row[header] || "")).join(","));
  });
  return lines.join("\n");
}

export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
