export type CsvRow = Record<string, string>;

export type CleanOptions = {
  preset: "generic" | "gumroad" | "lemon" | "kofi" | "etsy" | "stripe";
  dedupe: boolean;
  keepCancelled: boolean;
};

export type CleanResult = {
  rows: CsvRow[];
  headers: string[];
  summary: {
    imported: number;
    exported: number;
    emptyRemoved: number;
    duplicatesRemoved: number;
    cancelledRemoved: number;
    columnsNormalized: number;
  };
};

const HEADER_ALIASES: Record<string, string[]> = {
  customer_name: ["name", "customer", "customer name", "buyer", "full name", "client"],
  email: ["email", "e-mail", "buyer email", "customer email", "user email"],
  product: ["product", "item", "item name", "product name", "listing", "plan"],
  order_id: ["order id", "order", "id", "transaction id", "payment id", "charge id"],
  order_date: ["date", "created", "created at", "order date", "paid at", "sale date"],
  amount: ["amount", "price", "total", "gross", "paid", "payment amount"],
  currency: ["currency", "ccy"],
  status: ["status", "state", "payment status"],
  platform: ["platform", "source", "channel", "store"]
};

const PLATFORM_LABELS: Record<CleanOptions["preset"], string> = {
  generic: "Imported CSV",
  gumroad: "Gumroad",
  lemon: "Lemon Squeezy",
  kofi: "Ko-fi",
  etsy: "Etsy",
  stripe: "Stripe"
};

const STANDARD_HEADERS = [
  "customer_name",
  "email",
  "product",
  "order_id",
  "order_date",
  "amount",
  "currency",
  "status",
  "platform"
];

export function parseCsv(input: string): CsvRow[] {
  const trimmed = input.replace(/^\uFEFF/, "").trim();
  if (!trimmed) {
    return [];
  }

  const records: string[][] = [];
  let row: string[] = [];
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

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(cell);
      records.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  row.push(cell);
  records.push(row);

  const [headerRecord, ...body] = records.filter((record) =>
    record.some((value) => value.trim())
  );
  if (!headerRecord) {
    return [];
  }

  const headers = headerRecord.map((header, index) =>
    normalizeHeader(header || `column_${index + 1}`)
  );

  return body.map((record) => {
    const nextRow: CsvRow = {};
    headers.forEach((header, index) => {
      nextRow[header] = (record[index] || "").trim();
    });
    return nextRow;
  });
}

export function cleanCsvRows(rows: CsvRow[], options: CleanOptions): CleanResult {
  const imported = rows.length;
  const mappedRows = rows.map((row) => mapStandardColumns(row, options.preset));
  const nonEmpty = mappedRows.filter((row) =>
    Object.values(row).some((value) => value.trim())
  );
  const withoutCancelled = options.keepCancelled
    ? nonEmpty
    : nonEmpty.filter((row) => !isCancelled(row.status));

  const seen = new Set<string>();
  const cleaned: CsvRow[] = [];
  let duplicatesRemoved = 0;

  for (const row of withoutCancelled) {
    const normalized = normalizeValues(row, options.preset);
    const fingerprint = [
      normalized.email,
      normalized.order_id,
      normalized.product,
      normalized.amount,
      normalized.order_date
    ]
      .join("|")
      .toLowerCase();

    if (options.dedupe && seen.has(fingerprint)) {
      duplicatesRemoved += 1;
      continue;
    }

    seen.add(fingerprint);
    cleaned.push(normalized);
  }

  const headers = [...STANDARD_HEADERS, ...collectExtraHeaders(cleaned)];
  return {
    rows: cleaned,
    headers,
    summary: {
      imported,
      exported: cleaned.length,
      emptyRemoved: imported - nonEmpty.length,
      duplicatesRemoved,
      cancelledRemoved: nonEmpty.length - withoutCancelled.length,
      columnsNormalized: STANDARD_HEADERS.length
    }
  };
}

export function stringifyCsv(rows: CsvRow[], headers: string[]): string {
  const lines = [headers.map(escapeCell).join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escapeCell(row[header] || "")).join(","));
  });
  return lines.join("\n");
}

export function sampleCsv(): string {
  const rows = Array.from({ length: 32 }, (_, index) => {
    const n = index + 1;
    const status = n % 11 === 0 ? "refunded" : "paid";
    const product = n % 3 === 0 ? "Launch Template" : "Creator Pack";
    const duplicateEmail = n === 18 ? "buyer-5@example.com" : `buyer-${n}@example.com`;
    const duplicateId = n === 18 ? "GM-1005" : `GM-${1000 + n}`;
    return [
      duplicateId,
      `Buyer ${n}`,
      duplicateEmail,
      product,
      `2026-06-${String((n % 27) + 1).padStart(2, "0")}`,
      n % 2 === 0 ? "$29.00" : "19",
      "USD",
      status
    ].join(",");
  });

  return [
    "Order ID,Customer Name,Buyer Email,Product Name,Created At,Amount,Currency,Status",
    ...rows
  ].join("\n");
}

function mapStandardColumns(row: CsvRow, preset: CleanOptions["preset"]): CsvRow {
  const mapped: CsvRow = {};
  const entries = Object.entries(row);

  for (const header of STANDARD_HEADERS) {
    const aliases = HEADER_ALIASES[header] || [];
    const match = entries.find(([key]) =>
      aliases.some((alias) => normalizeHeader(alias) === key.toLowerCase())
    );
    mapped[header] = match ? match[1] : "";
  }

  for (const [key, value] of entries) {
    const isStandard = STANDARD_HEADERS.some((header) =>
      (HEADER_ALIASES[header] || []).some((alias) => normalizeHeader(alias) === key.toLowerCase())
    );
    if (!isStandard && !STANDARD_HEADERS.includes(key)) {
      mapped[key] = value;
    }
  }

  if (!mapped.platform) {
    mapped.platform = PLATFORM_LABELS[preset];
  }

  return mapped;
}

function normalizeValues(row: CsvRow, preset: CleanOptions["preset"]): CsvRow {
  return {
    ...row,
    customer_name: titleCase(row.customer_name),
    email: row.email.trim().toLowerCase(),
    product: row.product.trim(),
    order_id: row.order_id.trim(),
    order_date: normalizeDate(row.order_date),
    amount: normalizeMoney(row.amount),
    currency: (row.currency || inferCurrency(row.amount) || "USD").trim().toUpperCase(),
    status: (row.status || "paid").trim().toLowerCase(),
    platform: row.platform || PLATFORM_LABELS[preset]
  };
}

function normalizeHeader(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function collectExtraHeaders(rows: CsvRow[]): string[] {
  const extras = new Set<string>();
  rows.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (!STANDARD_HEADERS.includes(key)) {
        extras.add(key);
      }
    });
  });
  return [...extras];
}

function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function titleCase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

function normalizeMoney(value: string): string {
  const number = value.replace(/[^0-9.-]/g, "");
  if (!number) {
    return "";
  }
  return Number.parseFloat(number).toFixed(2);
}

function inferCurrency(value: string): string {
  if (value.includes("$")) return "USD";
  if (value.includes("€")) return "EUR";
  if (value.includes("£")) return "GBP";
  return "";
}

function normalizeDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.trim();
  }
  return date.toISOString().slice(0, 10);
}

function isCancelled(value: string): boolean {
  return ["refunded", "refund", "cancelled", "canceled", "failed", "void"].includes(
    value.trim().toLowerCase()
  );
}
