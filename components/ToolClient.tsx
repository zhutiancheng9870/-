"use client";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  RefreshCw,
  TableProperties,
  Upload
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  downloadCsv,
  downloadExcel,
  exportStandardCsv,
  parseCsvText,
  parseSpreadsheetFile,
  prepareTable,
  type ColumnMapping,
  type ParsedTable,
  type PrepareResult,
  type TemplateDefinition
} from "@/lib/csv";
import { templates } from "@/lib/templates";

const samples: Record<string, string> = {
  "bank-statement": `Posted Date,Account,Details,Merchant,Debit,Credit,Running Balance,Currency,Transaction ID,Category
2026/06/01,Chase Checking,Adobe Creative Cloud,Adobe,59.99,,10420.31,USD,TXN-1001,Software
06-02-2026,Chase Checking,Client retainer payment,Acme Studio,,2500,12920.31,USD,TXN-1002,Income
2026.06.02,Chase Checking,Client retainer payment,Acme Studio,,2500,12920.31,USD,TXN-1002,Income
2026/06/04,Chase Checking,Office rent,Main Street Offices,"1,800",,11120.31,USD,TXN-1003,Rent
bad-date,Chase Checking,Unknown card charge,,1200000,,0,USD,TXN-1004,Review`,
  "quickbooks-bank-csv": `Date,Description,Amount,Reference,Category
2026/06/01,Adobe Creative Cloud,-59.99,TXN-1001,Software
06-02-2026,Client retainer payment,2500,TXN-1002,Income
2026.06.02,Client retainer payment,2500,TXN-1002,Income
2026/06/04,Office rent,"-1,800",TXN-1003,Rent
bad-date,Unknown card charge,-1200000,TXN-1004,Review`,
  "xero-bank-csv": `Transaction Date,Net Amount,Payee,Narrative,Reference,Currency
2026/06/01,-59.99,Adobe,Adobe Creative Cloud,TXN-1001,USD
06-02-2026,2500,Acme Studio,Client retainer payment,TXN-1002,USD
2026.06.02,2500,Acme Studio,Client retainer payment,TXN-1002,USD
2026/06/04,"-1,800",Main Street Offices,Office rent,TXN-1003,USD
bad-date,-1200000,,Unknown card charge,TXN-1004,USD`
};

export function ToolClient() {
  const firstTemplate = templates[0];
  const [templateId, setTemplateId] = useState(firstTemplate.id);
  const [rawText, setRawText] = useState(samples[firstTemplate.id]);
  const [fileName, setFileName] = useState("sample-bank-statement.csv");
  const [parsed, setParsed] = useState<ParsedTable | null>(() =>
    parseCsvText(samples[firstTemplate.id], "sample-bank-statement.csv")
  );
  const [result, setResult] = useState<PrepareResult | null>(() =>
    prepareTable(parseCsvText(samples[firstTemplate.id], "sample-bank-statement.csv"), firstTemplate)
  );
  const [error, setError] = useState("");
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === templateId) ?? firstTemplate,
    [templateId, firstTemplate]
  );

  const duplicateRows = result?.duplicateIssues.length ?? 0;
  const errorCount = result?.anomalyIssues.filter((issue) => issue.severity === "error").length ?? 0;
  const warningCount =
    result?.anomalyIssues.filter((issue) => issue.severity === "warning").length ?? 0;

  function processParsed(nextParsed: ParsedTable, template = selectedTemplate, mapping?: ColumnMapping) {
    if (nextParsed.headers.length === 0) {
      setResult(null);
      setError("Upload or paste a file with a header row first.");
      return;
    }
    setError("");
    setParsed(nextParsed);
    setResult(prepareTable(nextParsed, template, mapping));
  }

  function runPastedText(input = rawText) {
    try {
      processParsed(parseCsvText(input, fileName || "pasted-bank-statement.csv"));
    } catch (nextError) {
      setResult(null);
      setError(nextError instanceof Error ? nextError.message : "The table could not be parsed.");
    }
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      setFileName(file.name);
      const nextParsed = await parseSpreadsheetFile(file);
      setRawText(file.name.toLowerCase().endsWith(".xlsx") ? "" : await file.text());
      processParsed(nextParsed);
    } catch (nextError) {
      setResult(null);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "The file could not be read. Upload a CSV, TSV, or XLSX file."
      );
    }
  }

  function loadSample() {
    const nextSample = samples[templateId];
    const nextParsed = parseCsvText(nextSample, `sample-${templateId}.csv`);
    setRawText(nextSample);
    setFileName(`sample-${templateId}.csv`);
    processParsed(nextParsed);
  }

  function changeTemplate(nextTemplateId: string) {
    const nextTemplate = templates.find((template) => template.id === nextTemplateId) ?? firstTemplate;
    const nextSample = samples[nextTemplate.id] ?? samples[firstTemplate.id];
    const nextParsed = parseCsvText(nextSample, `sample-${nextTemplate.id}.csv`);
    setTemplateId(nextTemplate.id);
    setRawText(nextSample);
    setFileName(`sample-${nextTemplate.id}.csv`);
    setParsed(nextParsed);
    setResult(prepareTable(nextParsed, nextTemplate));
    setError("");
  }

  function updateMapping(field: string, source: string) {
    if (!parsed || !result) return;
    const nextMapping = { ...result.mapping, [field]: source || null };
    setResult(prepareTable(parsed, selectedTemplate, nextMapping));
  }

  function exportCsv() {
    if (!result) {
      setError("Clean a file before exporting CSV.");
      return;
    }
    downloadCsv(
      exportStandardCsv(result.normalizedRows, selectedTemplate),
      `${selectedTemplate.id}-cleaned.csv`
    );
  }

  async function exportExcel() {
    if (!result) {
      setError("Clean a file before exporting Excel.");
      return;
    }
    setIsExportingExcel(true);
    try {
      await downloadExcel(result.normalizedRows, selectedTemplate, `${selectedTemplate.id}-cleaned.xlsx`);
    } finally {
      setIsExportingExcel(false);
    }
  }

  return (
    <div className="panel tool-panel" id="demo">
      <div className="panel-header">
        <div>
          <p className="panel-title">Live cleaner demo</p>
          <p className="small-copy" style={{ margin: 0 }}>
            Upload CSV/XLSX, map columns, validate rows, and export a bookkeeping-ready file.
          </p>
        </div>
        <span className="badge badge-teal">
          <TableProperties className="icon" />
          CSV + Excel
        </span>
      </div>

      <div className="tool-body">
        <div className="controls-grid">
          <div className="field">
            <label htmlFor="template">Output template</label>
            <select
              id="template"
              value={templateId}
              onChange={(event) => changeTemplate(event.target.value)}
            >
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="file">Upload file</label>
            <input
              id="file"
              aria-label="Upload CSV or Excel file"
              type="file"
              accept=".csv,.tsv,.xlsx,text/csv"
              onChange={(event) => void handleFile(event.target.files?.[0])}
            />
          </div>
          <div className="field">
            <label>Current file</label>
            <div className="readonly-field">{fileName || "No file loaded"}</div>
          </div>
        </div>

        <div className="upload-zone">
          <Upload aria-hidden="true" />
          <div>
            <strong>Paste messy bank data or load a sample</strong>
            <p className="small-copy" style={{ marginBottom: 0 }}>
              Handles mixed dates, currency symbols, thousands separators, missing values, duplicate
              rows, and unusually large transactions.
            </p>
          </div>
        </div>

        <textarea
          aria-label="Paste CSV text"
          className="textarea"
          placeholder="Paste CSV / TSV bank statement content here..."
          value={rawText}
          onChange={(event) => setRawText(event.target.value)}
        />

        <div className="button-row">
          <button className="primary-button" onClick={() => runPastedText()} type="button">
            <RefreshCw className="icon" />
            Clean pasted data
          </button>
          <button className="secondary-button" onClick={loadSample} type="button">
            <FileSpreadsheet className="icon" />
            Load sample
          </button>
          <button className="secondary-button" disabled={!result} onClick={exportCsv} type="button">
            <Download className="icon" />
            Export cleaned CSV
          </button>
          <button
            className="primary-button"
            disabled={!result || isExportingExcel}
            onClick={() => void exportExcel()}
            type="button"
          >
            <Download className="icon" />
            {isExportingExcel ? "Generating..." : "Export cleaned Excel"}
          </button>
        </div>

        {error ? (
          <div className="alert alert-error" role="alert">
            <AlertCircle className="icon" />
            <span>{error}</span>
          </div>
        ) : null}

        {result ? (
          <>
            <div className="summary-grid" aria-label="Cleaning summary">
              <div className="metric">
                <strong>{result.parsed.records.length}</strong>
                <span>Raw rows</span>
              </div>
              <div className="metric">
                <strong>{result.normalizedRows.length}</strong>
                <span>Cleaned rows</span>
              </div>
              <div className="metric">
                <strong>{result.emptyRowsRemoved}</strong>
                <span>Empty rows removed</span>
              </div>
              <div className="metric">
                <strong>{duplicateRows}</strong>
                <span>Possible duplicates</span>
              </div>
            </div>

            <div className="alert alert-success" role="status">
              <CheckCircle2 className="icon" />
              <span>
                {selectedTemplate.name} generated with {errorCount} required-field errors and{" "}
                {warningCount} warnings.
              </span>
            </div>

            <section className="mapping-panel" aria-label="Column mapping">
              <div>
                <h3>Column mapping</h3>
                <p className="small-copy">
                  StatementReady matched headers automatically. Override any field before export.
                </p>
              </div>
              <div className="mapping-grid">
                {selectedTemplate.columns.map((column) => (
                  <label className="field" key={column.key}>
                    <span>
                      {column.label}
                      {column.required ? " *" : ""}
                    </span>
                    <select
                      aria-label={`${column.label} source column`}
                      value={result.mapping[column.key] ?? ""}
                      onChange={(event) => updateMapping(column.key, event.target.value)}
                    >
                      <option value="">Do not map</option>
                      {result.parsed.headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>

            {result.anomalyIssues.length > 0 ? (
              <section className="issue-list" aria-label="Validation errors">
                <h3>Validation errors</h3>
                {result.anomalyIssues.slice(0, 8).map((issue, index) => (
                  <div className="issue-row" key={`${issue.rowIndex}-${issue.field}-${index}`}>
                    <span className={issue.severity === "error" ? "badge badge-coral" : "badge badge-amber"}>
                      Row {issue.rowIndex + 1}
                    </span>
                    <span>
                      {issue.field}: {issue.message}
                    </span>
                  </div>
                ))}
              </section>
            ) : null}

            <div className="table-wrap" aria-label="Cleaned table preview">
              <table>
                <thead>
                  <tr>
                    {selectedTemplate.columns.slice(0, 8).map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.normalizedRows.slice(0, 8).map((row, index) => (
                    <tr key={`${index}-${selectedTemplate.id}`}>
                      {selectedTemplate.columns.slice(0, 8).map((column) => (
                        <td key={column.key}>{row[column.key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
