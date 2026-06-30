import { detectAnomalies } from "./detect-anomalies";
import { detectDuplicates } from "./detect-duplicates";
import { detectColumnMapping, mapRows } from "./map-columns";
import { normalizeRows, removeEmptyRows } from "./normalize";
import type { ColumnMapping, ParsedTable, PrepareResult, TemplateDefinition } from "./types";

export function prepareTable(
  parsed: ParsedTable,
  template: TemplateDefinition,
  mappingOverride?: ColumnMapping
): PrepareResult {
  const mapping = mappingOverride ?? detectColumnMapping(parsed.headers, template);
  const mappedRows = mapRows(parsed, mapping, template);
  const { rows: nonEmptyRows, removed } = removeEmptyRows(mappedRows);
  const normalizedRows = normalizeRows(nonEmptyRows, template);
  const duplicateIssues = detectDuplicates(normalizedRows, template.duplicateKeys);
  const anomalyIssues = detectAnomalies(normalizedRows, template);

  return {
    parsed,
    mapping,
    mappedRows: nonEmptyRows,
    normalizedRows,
    emptyRowsRemoved: removed,
    duplicateIssues,
    anomalyIssues,
    headers: template.columns.map((column) => column.key)
  };
}
