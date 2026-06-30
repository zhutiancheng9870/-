import type { MappedRow, NormalizedRow, TemplateDefinition } from "./types";

export function removeEmptyRows(rows: MappedRow[]): { rows: MappedRow[]; removed: number } {
  const kept = rows.filter((row) => Object.values(row).some((value) => String(value).trim()));
  return { rows: kept, removed: rows.length - kept.length };
}

export function normalizeRows(rows: MappedRow[], template: TemplateDefinition): NormalizedRow[] {
  return rows.map((row) => {
    const next: NormalizedRow = {};
    template.columns.forEach((column) => {
      const value = row[column.key] || "";
      if (column.type === "date") {
        next[column.key] = normalizeDateValue(value);
      } else if (column.type === "amount" || column.type === "number") {
        next[column.key] = normalizeAmountValue(value);
      } else {
        next[column.key] = normalizeTextValue(value);
      }
    });
    return next;
  });
}

export function normalizeTextValue(value: string): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function normalizeDateValue(value: string): string {
  const raw = normalizeTextValue(value);
  if (!raw) return "";

  const excelSerial = Number(raw);
  if (/^\d{5}(\.\d+)?$/.test(raw) && excelSerial > 25000) {
    const excelEpoch = Date.UTC(1899, 11, 30);
    return new Date(excelEpoch + excelSerial * 86400000).toISOString().slice(0, 10);
  }

  const normalized = raw.replace(/[.]/g, "-").replace(/\//g, "-");

  const ymd = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (ymd) {
    return [ymd[1], ymd[2].padStart(2, "0"), ymd[3].padStart(2, "0")].join("-");
  }

  const dmy = normalized.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (dmy) {
    return [dmy[3], dmy[2].padStart(2, "0"), dmy[1].padStart(2, "0")].join("-");
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return raw;
  }
  return parsed.toISOString().slice(0, 10);
}

export function normalizeAmountValue(value: string): string {
  const raw = normalizeTextValue(value);
  if (!raw) return "";

  const isNegative =
    raw.includes("(") ||
    raw.includes(")") ||
    raw.toLowerCase().includes("debit") ||
    raw.toLowerCase().includes("withdrawal") ||
    raw.toLowerCase().includes("out") ||
    raw.trim().startsWith("-");
  const numeric = raw.replace(/,/g, "").replace(/[^0-9.]/g, "");
  if (!numeric) {
    return raw;
  }
  const amount = Number.parseFloat(numeric);
  if (Number.isNaN(amount)) {
    return raw;
  }
  return `${isNegative ? "-" : ""}${amount.toFixed(2)}`;
}
