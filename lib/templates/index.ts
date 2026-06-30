import { bankStatementTemplate } from "./bank-statement";
import { quickBooksBankCsvTemplate } from "./quickbooks-bank-csv";
import { xeroBankCsvTemplate } from "./xero-bank-csv";

export const templates = [
  bankStatementTemplate,
  quickBooksBankCsvTemplate,
  xeroBankCsvTemplate
];

export { bankStatementTemplate, quickBooksBankCsvTemplate, xeroBankCsvTemplate };
