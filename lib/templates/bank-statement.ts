import type { TemplateDefinition } from "@/lib/csv";

export const bankStatementTemplate: TemplateDefinition = {
  id: "bank-statement",
  name: "Generic bank statement",
  description:
    "Normalize messy bank, card, PayPal, Stripe, and wallet exports into a bookkeeping-ready statement.",
  duplicateKeys: ["date", "description", "money_out", "money_in", "balance", "reference"],
  amountFields: ["money_out", "money_in", "balance"],
  dateFields: ["date"],
  columns: [
    {
      key: "date",
      label: "Date",
      aliases: ["date", "posted date", "transaction date", "txn date", "created"],
      required: true,
      type: "date"
    },
    {
      key: "account",
      label: "Account",
      aliases: ["account", "account name", "account number", "bank account", "source"],
      type: "text"
    },
    {
      key: "description",
      label: "Description",
      aliases: ["description", "memo", "narrative", "details", "merchant", "payee", "name"],
      required: true,
      type: "text"
    },
    {
      key: "counterparty",
      label: "Counterparty",
      aliases: ["counterparty", "payee", "payer", "merchant", "vendor", "customer"],
      type: "text"
    },
    {
      key: "money_out",
      label: "Money Out",
      aliases: ["money out", "debit", "withdrawal", "spent", "outflow", "amount debit", "charge"],
      type: "amount"
    },
    {
      key: "money_in",
      label: "Money In",
      aliases: ["money in", "credit", "deposit", "received", "inflow", "amount credit"],
      type: "amount"
    },
    {
      key: "balance",
      label: "Balance",
      aliases: ["balance", "running balance", "available balance"],
      type: "amount"
    },
    {
      key: "currency",
      label: "Currency",
      aliases: ["currency", "ccy", "iso currency"],
      type: "text"
    },
    {
      key: "reference",
      label: "Reference",
      aliases: ["reference", "transaction id", "transaction id", "id", "ref", "bank ref"],
      type: "text"
    },
    {
      key: "category",
      label: "Category",
      aliases: ["category", "class", "type", "accounting category"],
      type: "text"
    }
  ]
};
