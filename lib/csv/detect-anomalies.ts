import type { AnomalyIssue, NormalizedRow, TemplateDefinition } from "./types";

export function detectAnomalies(
  rows: NormalizedRow[],
  template: TemplateDefinition
): AnomalyIssue[] {
  const issues: AnomalyIssue[] = [];
  const required = template.columns.filter((column) => column.required);

  rows.forEach((row, rowIndex) => {
    required.forEach((column) => {
      if (!String(row[column.key] || "").trim()) {
        issues.push({
          rowIndex,
          field: column.key,
          message: `${column.label} is missing.`,
          severity: "error"
        });
      }
    });

    template.dateFields.forEach((field) => {
      const value = row[field];
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        issues.push({
          rowIndex,
          field,
          message: `${field} is not a normalized yyyy-mm-dd date.`,
          severity: "warning"
        });
      }
    });

    template.amountFields.forEach((field) => {
      const value = row[field];
      if (value && Number.isNaN(Number(value))) {
        issues.push({
          rowIndex,
          field,
          message: `${field} is not a valid amount.`,
          severity: "warning"
        });
      }
      if (value && Math.abs(Number(value)) >= 1000000) {
        issues.push({
          rowIndex,
          field,
          message: `${field} is unusually large.`,
          severity: "warning"
        });
      }
    });
  });

  return issues;
}
