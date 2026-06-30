import type { TemplateDefinition } from "@/lib/csv";

export const xeroBankCsvTemplate: TemplateDefinition = {
  id: "xero-bank-csv",
  name: "Xero-ready bank CSV",
  description:
    "Prepare bank statement rows with Date, Amount, Payee, Description, Reference, and Currency fields.",
  duplicateKeys: ["date", "amount", "payee", "description", "reference"],
  amountFields: ["amount"],
  dateFields: ["date"],
  columns: [
    {
      key: "date",
      label: "Date",
      aliases: ["date", "posted date", "transaction date", "txn date"],
      required: true,
      type: "date"
    },
    {
      key: "amount",
      label: "Amount",
      aliases: ["amount", "net amount", "transaction amount", "debit", "credit"],
      required: true,
      type: "amount"
    },
    {
      key: "payee",
      label: "Payee",
      aliases: ["payee", "payer", "merchant", "vendor", "counterparty", "name"],
      type: "text"
    },
    {
      key: "description",
      label: "Description",
      aliases: ["description", "memo", "narrative", "details"],
      required: true,
      type: "text"
    },
    {
      key: "reference",
      label: "Reference",
      aliases: ["reference", "transaction id", "id", "ref"],
      type: "text"
    },
    {
      key: "currency",
      label: "Currency",
      aliases: ["currency", "ccy", "iso currency"],
      type: "text"
    }
  ]
};
