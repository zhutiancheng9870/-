import JSZip from "jszip";
import type { ParsedTable, RawCell, RawRow } from "./types";

export function parseCsvText(input: string, sourceName?: string): ParsedTable {
  const trimmed = input.replace(/^\uFEFF/, "").trim();
  if (!trimmed) {
    return toParsedTable([], sourceName);
  }

  const delimiter = detectDelimiter(trimmed);
  const rows: RawRow[] = [];
  let row: RawRow = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < trimmed.length; i += 1) {
    const char = trimmed[i];
    const next = trimmed[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(cell.trim());
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell.trim());
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell.trim());
  rows.push(row);
  return toParsedTable(rows, sourceName);
}

export async function parseSpreadsheetFile(file: File): Promise<ParsedTable> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".csv") || name.endsWith(".tsv")) {
    return parseCsvText(await file.text(), file.name);
  }
  if (name.endsWith(".xlsx")) {
    return parseXlsxBuffer(await file.arrayBuffer(), file.name);
  }
  throw new Error("Please upload a .csv, .tsv, or .xlsx file.");
}

export async function parseXlsxBuffer(buffer: ArrayBuffer, sourceName?: string): Promise<ParsedTable> {
  const zip = await JSZip.loadAsync(buffer);
  const workbookXml = await zip.file("xl/workbook.xml")?.async("text");
  if (!workbookXml) {
    throw new Error("The Excel workbook is missing xl/workbook.xml.");
  }

  const workbookRels = await zip.file("xl/_rels/workbook.xml.rels")?.async("text");
  const sharedStringsXml = await zip.file("xl/sharedStrings.xml")?.async("text");
  const sheetPath = resolveFirstSheetPath(workbookXml, workbookRels || "");
  const sheetXml = await zip.file(sheetPath)?.async("text");
  if (!sheetXml) {
    throw new Error("The Excel workbook does not contain a readable first sheet.");
  }

  const sharedStrings = sharedStringsXml ? parseSharedStrings(sharedStringsXml) : [];
  return toParsedTable(parseSheetRows(sheetXml, sharedStrings), sourceName);
}

export function normalizeHeader(value: string): string {
  const ascii = value
    .trim()
    .toLowerCase()
    .replace(/[\s\-./\\]+/g, "_")
    .replace(/[^a-z0-9_\u4e00-\u9fa5]+/g, "")
    .replace(/^_+|_+$/g, "");
  return ascii || "column";
}

function toParsedTable(rawRows: RawRow[], sourceName?: string): ParsedTable {
  const nonEmptyRows = rawRows.filter((row) => row.some((cell) => String(cell ?? "").trim()));
  if (nonEmptyRows.length === 0) {
    return { headers: [], rows: [], records: [], sourceName };
  }

  const headerIndex = detectHeaderRowIndex(nonEmptyRows);
  const headerRow = nonEmptyRows[headerIndex];
  const headers = makeUniqueHeaders(headerRow.map((cell, index) => String(cell || `Column ${index + 1}`)));
  const rows = nonEmptyRows.slice(headerIndex + 1);
  const records = rows.map((row) => {
    const record: Record<string, RawCell> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    return record;
  });

  return { headers, rows, records, sourceName };
}

function detectDelimiter(input: string): "," | "\t" | ";" {
  const firstLine = input.split(/\r?\n/).find(Boolean) || "";
  const counts = {
    ",": firstLine.split(",").length,
    "\t": firstLine.split("\t").length,
    ";": firstLine.split(";").length
  };
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] || ",") as "," | "\t" | ";";
}

function detectHeaderRowIndex(rows: RawRow[]): number {
  let bestIndex = 0;
  let bestScore = -1;
  rows.slice(0, 8).forEach((row, index) => {
    const filled = row.filter((cell) => String(cell ?? "").trim()).length;
    const textLike = row.filter((cell) => /[A-Za-z\u4e00-\u9fa5]/.test(String(cell ?? ""))).length;
    const score = filled + textLike * 1.5;
    if (score > bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function makeUniqueHeaders(headers: string[]): string[] {
  const seen = new Map<string, number>();
  return headers.map((header, index) => {
    const normalized = normalizeHeader(header || `column_${index + 1}`);
    const count = seen.get(normalized) || 0;
    seen.set(normalized, count + 1);
    return count === 0 ? normalized : `${normalized}_${count + 1}`;
  });
}

function resolveFirstSheetPath(workbookXml: string, relsXml: string): string {
  const workbook = parseXml(workbookXml);
  const firstSheet = workbook.querySelector("sheet");
  const relationId = firstSheet?.getAttribute("r:id");
  if (!relationId) {
    return "xl/worksheets/sheet1.xml";
  }

  const rels = parseXml(relsXml);
  const relation = Array.from(rels.querySelectorAll("Relationship")).find(
    (item) => item.getAttribute("Id") === relationId
  );
  const target = relation?.getAttribute("Target") || "worksheets/sheet1.xml";
  return target.startsWith("/") ? target.slice(1) : `xl/${target.replace(/^xl\//, "")}`;
}

function parseSharedStrings(xml: string): string[] {
  const doc = parseXml(xml);
  return Array.from(doc.querySelectorAll("si")).map((node) =>
    Array.from(node.querySelectorAll("t"))
      .map((textNode) => textNode.textContent || "")
      .join("")
  );
}

function parseSheetRows(xml: string, sharedStrings: string[]): RawRow[] {
  const doc = parseXml(xml);
  return Array.from(doc.querySelectorAll("sheetData row")).map((rowNode) => {
    const cells: RawRow = [];
    Array.from(rowNode.querySelectorAll("c")).forEach((cellNode) => {
      const ref = cellNode.getAttribute("r") || "";
      const columnIndex = columnRefToIndex(ref.replace(/\d+/g, ""));
      const type = cellNode.getAttribute("t");
      const rawValue = cellNode.querySelector("v")?.textContent || "";
      const inlineText = cellNode.querySelector("is t")?.textContent || "";
      cells[columnIndex] =
        type === "s"
          ? sharedStrings[Number(rawValue)] || ""
          : type === "inlineStr"
            ? inlineText
            : rawValue;
    });
    return cells;
  });
}

function columnRefToIndex(ref: string): number {
  if (!ref) return 0;
  return ref
    .toUpperCase()
    .split("")
    .reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
}

function parseXml(xml: string): Document {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error("The Excel XML could not be parsed.");
  }
  return doc;
}
