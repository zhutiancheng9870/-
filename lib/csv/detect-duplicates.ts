import type { DuplicateIssue, NormalizedRow } from "./types";

export function detectDuplicates(
  rows: NormalizedRow[],
  keyFields: string[]
): DuplicateIssue[] {
  const seen = new Map<string, number>();
  const issues: DuplicateIssue[] = [];

  rows.forEach((row, index) => {
    const fingerprint = keyFields
      .map((field) => String(row[field] || "").trim().toLowerCase())
      .join("|");
    if (!fingerprint.replace(/\|/g, "")) {
      return;
    }
    const previous = seen.get(fingerprint);
    if (previous !== undefined) {
      issues.push({ rowIndex: index, duplicateOf: previous, fingerprint });
      return;
    }
    seen.set(fingerprint, index);
  });

  return issues;
}
