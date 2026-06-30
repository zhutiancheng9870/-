export type RawCell = string | number | boolean | null;

export type RawRow = RawCell[];

export type ParsedTable = {
  headers: string[];
  rows: RawRow[];
  records: Record<string, RawCell>[];
  sourceName?: string;
};

export type FieldType = "text" | "date" | "amount" | "number";

export type TemplateColumn = {
  key: string;
  label: string;
  aliases: string[];
  required?: boolean;
  type?: FieldType;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  description: string;
  duplicateKeys: string[];
  amountFields: string[];
  dateFields: string[];
  columns: TemplateColumn[];
};

export type ColumnMapping = Record<string, string | null>;

export type MappedRow = Record<string, string>;

export type NormalizedRow = Record<string, string>;

export type DuplicateIssue = {
  rowIndex: number;
  duplicateOf: number;
  fingerprint: string;
};

export type AnomalySeverity = "warning" | "error";

export type AnomalyIssue = {
  rowIndex: number;
  field: string;
  message: string;
  severity: AnomalySeverity;
};

export type PrepareResult = {
  parsed: ParsedTable;
  mapping: ColumnMapping;
  mappedRows: MappedRow[];
  normalizedRows: NormalizedRow[];
  emptyRowsRemoved: number;
  duplicateIssues: DuplicateIssue[];
  anomalyIssues: AnomalyIssue[];
  headers: string[];
};
