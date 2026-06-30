import type { TemplateDefinition } from "@/lib/csv";

export const quickBooksBankCsvTemplate: TemplateDefinition = {
  id: "quickbooks-bank-csv",
  name: "QuickBooks-ready bank CSV",
  description:
    "Prepare a compact Date, Description, Amount export for manual import or review before QuickBooks reconciliation.",
  duplicateKeys: ["date", "description", "amount", "reference"],
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
      key: "description",
      label: "Description",
      aliases: ["description", "memo", "narrative", "details", "merchant", "payee"],
      required: true,
      type: "text"
    },
    {
      key: "amount",
      label: "Amount",
      aliases: ["amount", "net", "total", "transaction amount", "debit", "credit"],
      required: true,
      type: "amount"
    },
    {
      key: "reference",
      label: "Reference",
      aliases: ["reference", "transaction id", "id", "ref"],
      type: "text"
    },
    {
      key: "category",
      label: "Category",
      aliases: ["category", "account", "class", "type"],
      type: "text"
    }
  ]
};
