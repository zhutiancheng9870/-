"use client";

import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  KeyRound,
  Lock,
  RefreshCw,
  Upload
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CleanOptions,
  CleanResult,
  cleanCsvRows,
  parseCsv,
  sampleCsv,
  stringifyCsv
} from "@/lib/csv";

const FREE_ROW_LIMIT = 25;
const LICENSE_STORAGE_KEY = "creatorcsv_unlock_code";

export function ToolClient() {
  const [rawCsv, setRawCsv] = useState("");
  const [fileName, setFileName] = useState("");
  const [preset, setPreset] = useState<CleanOptions["preset"]>("gumroad");
  const [dedupe, setDedupe] = useState(true);
  const [keepCancelled, setKeepCancelled] = useState(false);
  const [result, setResult] = useState<CleanResult | null>(null);
  const [error, setError] = useState("");
  const [licenseCode, setLicenseCode] = useState("");
  const [licenseMessage, setLicenseMessage] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const previewRows = useMemo(() => {
    if (!result) return [];
    return unlocked ? result.rows : result.rows.slice(0, FREE_ROW_LIMIT);
  }, [result, unlocked]);

  const hasLockedRows = Boolean(result && result.rows.length > FREE_ROW_LIMIT && !unlocked);

  useEffect(() => {
    const storedCode = window.localStorage.getItem(LICENSE_STORAGE_KEY);
    if (storedCode) {
      setLicenseCode(storedCode);
      void verifyLicense(storedCode);
    }
  }, []);

  function runClean(input = rawCsv) {
    setError("");
    setLicenseMessage("");
    try {
      const parsed = parseCsv(input);
      if (parsed.length === 0) {
        setResult(null);
        setError("Add a CSV file or paste CSV text before cleaning.");
        return;
      }
      setResult(cleanCsvRows(parsed, { preset, dedupe, keepCancelled }));
    } catch (nextError) {
      setResult(null);
      setError(
        nextError instanceof Error
          ? nextError.message
          : "The CSV could not be parsed. Check the file and try again."
      );
    }
  }

  function loadSample() {
    const sample = sampleCsv();
    setRawCsv(sample);
    setFileName("sample-gumroad-orders.csv");
    runClean(sample);
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      setRawCsv(text);
      setFileName(file.name);
      runClean(text);
    };
    reader.onerror = () => {
      setError("The file could not be read. Try exporting the CSV again.");
    };
    reader.readAsText(file);
  }

  async function verifyLicense(codeOverride?: string) {
    const codeToVerify = codeOverride ?? licenseCode;
    setIsVerifying(true);
    setLicenseMessage("");
    try {
      const response = await fetch("/api/license/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeToVerify })
      });
      const data = (await response.json()) as { ok: boolean; message: string };
      setUnlocked(data.ok);
      setLicenseMessage(data.message);
    } catch {
      setUnlocked(false);
      setLicenseMessage("License verification is unavailable. Try again in a minute.");
    } finally {
      setIsVerifying(false);
    }
  }

  function exportCsv(full: boolean) {
    if (!result) {
      setError("Clean a CSV before exporting.");
      return;
    }
    if (full && hasLockedRows) {
      setLicenseMessage("Enter an unlock code to export the full cleaned CSV.");
      return;
    }

    const rows = full || unlocked ? result.rows : result.rows.slice(0, FREE_ROW_LIMIT);
    const csv = stringifyCsv(rows, result.headers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = full || unlocked ? "cleaned-orders-full.csv" : "cleaned-orders-preview.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="panel tool-panel" id="try">
      <div className="panel-header">
        <div>
          <p className="panel-title">Clean an order CSV</p>
          <p className="small-copy" style={{ margin: 0 }}>
            Free preview: first {FREE_ROW_LIMIT} cleaned rows.
          </p>
        </div>
        <span className={unlocked ? "badge badge-teal" : "badge badge-coral"}>
          {unlocked ? <CheckCircle2 className="icon" /> : <Lock className="icon" />}
          {unlocked ? "Full export on" : "Full export locked"}
        </span>
      </div>

      <div className="tool-body">
        <div className="upload-zone">
          <Upload aria-hidden="true" />
          <div>
            <strong>{fileName || "Drop in a creator platform CSV"}</strong>
            <p className="small-copy" style={{ marginBottom: 0 }}>
              Gumroad, Lemon Squeezy, Ko-fi, Etsy, Stripe, or any generic sales export.
            </p>
          </div>
          <input
            aria-label="Upload CSV file"
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
        </div>

        <textarea
          aria-label="Paste CSV text"
          className="textarea"
          placeholder="Or paste CSV text here..."
          value={rawCsv}
          onChange={(event) => setRawCsv(event.target.value)}
        />

        <div className="controls-grid">
          <div className="field">
            <label htmlFor="preset">Platform preset</label>
            <select
              id="preset"
              value={preset}
              onChange={(event) => setPreset(event.target.value as CleanOptions["preset"])}
            >
              <option value="gumroad">Gumroad</option>
              <option value="lemon">Lemon Squeezy</option>
              <option value="kofi">Ko-fi</option>
              <option value="etsy">Etsy</option>
              <option value="stripe">Stripe</option>
              <option value="generic">Generic CSV</option>
            </select>
          </div>
          <label className="field">
            <span>Deduplicate rows</span>
            <select
              value={dedupe ? "yes" : "no"}
              onChange={(event) => setDedupe(event.target.value === "yes")}
            >
              <option value="yes">On</option>
              <option value="no">Off</option>
            </select>
          </label>
          <label className="field">
            <span>Refunded orders</span>
            <select
              value={keepCancelled ? "keep" : "remove"}
              onChange={(event) => setKeepCancelled(event.target.value === "keep")}
            >
              <option value="remove">Remove from export</option>
              <option value="keep">Keep in export</option>
            </select>
          </label>
        </div>

        <div className="button-row">
          <button className="primary-button" onClick={() => runClean()} type="button">
            <RefreshCw className="icon" />
            Clean pasted CSV
          </button>
          <button className="secondary-button" onClick={loadSample} type="button">
            <FileSpreadsheet className="icon" />
            Load sample data
          </button>
          <button
            className="secondary-button"
            disabled={!result}
            onClick={() => exportCsv(false)}
            type="button"
          >
            <Download className="icon" />
            Export free preview
          </button>
          <button
            className="primary-button"
            disabled={!result || hasLockedRows}
            onClick={() => exportCsv(true)}
            type="button"
          >
            <Download className="icon" />
            Export full CSV
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
                <strong>{result.summary.imported}</strong>
                <span>Rows imported</span>
              </div>
              <div className="metric">
                <strong>{result.summary.exported}</strong>
                <span>Rows ready</span>
              </div>
              <div className="metric">
                <strong>{result.summary.duplicatesRemoved}</strong>
                <span>Duplicates removed</span>
              </div>
              <div className="metric">
                <strong>{result.summary.cancelledRemoved}</strong>
                <span>Refunded/failed removed</span>
              </div>
            </div>

            {hasLockedRows ? (
              <div className="alert alert-error" role="status">
                <Lock className="icon" />
                <span>
                  Free mode shows and exports {FREE_ROW_LIMIT} rows. Unlock to export all{" "}
                  {result.rows.length} cleaned rows and reuse the workflow.
                </span>
              </div>
            ) : (
              <div className="alert alert-success" role="status">
                <CheckCircle2 className="icon" />
                <span>The cleaned CSV is ready to export.</span>
              </div>
            )}

            <div className="field">
              <label htmlFor="license">Unlock code</label>
              <div className="button-row">
                <input
                  id="license"
                  aria-label="Unlock code"
                  placeholder="Enter code after purchase"
                  value={licenseCode}
                  onChange={(event) => setLicenseCode(event.target.value)}
                />
                <button
                  className="secondary-button"
                  disabled={isVerifying}
                  onClick={() => verifyLicense()}
                  type="button"
                >
                  <KeyRound className="icon" />
                  {isVerifying ? "Checking..." : "Verify"}
                </button>
                <a className="primary-button" href="/checkout">
                  <Lock className="icon" />
                  Buy unlock key
                </a>
              </div>
              {licenseMessage ? <p className="small-copy">{licenseMessage}</p> : null}
            </div>

            <div className="table-wrap" aria-label="Cleaned CSV preview">
              <table>
                <thead>
                  <tr>
                    {result.headers.slice(0, 7).map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.slice(0, 10).map((row, index) => (
                    <tr key={`${row.order_id}-${index}`}>
                      {result.headers.slice(0, 7).map((header) => (
                        <td key={header}>{row[header]}</td>
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
