// The Business Central tables the report counts, with plain-English names.
// Anything not listed here (system, setup and auto-generated helper tables)
// is left out of the headline figures and only shown in the technical detail.

export type Bucket = "master" | "transaction" | "setup";

export type CatalogEntry = {
  no: number;
  label: string;
  bucket: Bucket;
  group: string;
};

export const CATALOG: CatalogEntry[] = [
  // Full records (master data)
  { no: 18, label: "Customers", bucket: "master", group: "Full records" },
  { no: 23, label: "Vendors", bucket: "master", group: "Full records" },
  { no: 27, label: "Items (products & services)", bucket: "master", group: "Full records" },
  { no: 5600, label: "Fixed assets", bucket: "master", group: "Full records" },
  { no: 156, label: "Resources", bucket: "master", group: "Full records" },
  { no: 5200, label: "Employees", bucket: "master", group: "Full records" },

  // Transactions
  { no: 17, label: "General ledger entries", bucket: "transaction", group: "Accounting" },
  { no: 254, label: "Tax entries", bucket: "transaction", group: "Accounting" },
  { no: 81, label: "Journal lines waiting to post", bucket: "transaction", group: "Accounting" },
  { no: 5601, label: "Fixed asset entries", bucket: "transaction", group: "Accounting" },
  { no: 112, label: "Posted sales invoices", bucket: "transaction", group: "Sales" },
  { no: 110, label: "Posted sales shipments", bucket: "transaction", group: "Sales" },
  { no: 114, label: "Posted sales credit memos", bucket: "transaction", group: "Sales" },
  { no: 36, label: "Open sales quotes & orders", bucket: "transaction", group: "Sales" },
  { no: 21, label: "Customer ledger entries", bucket: "transaction", group: "Sales" },
  { no: 122, label: "Posted purchase invoices", bucket: "transaction", group: "Purchasing" },
  { no: 120, label: "Posted purchase receipts", bucket: "transaction", group: "Purchasing" },
  { no: 124, label: "Posted purchase credit memos", bucket: "transaction", group: "Purchasing" },
  { no: 38, label: "Open purchase orders", bucket: "transaction", group: "Purchasing" },
  { no: 25, label: "Vendor ledger entries", bucket: "transaction", group: "Purchasing" },
  { no: 271, label: "Bank transactions", bucket: "transaction", group: "Bank & inventory" },
  { no: 32, label: "Inventory movements", bucket: "transaction", group: "Bank & inventory" },

  // Setup
  { no: 15, label: "Chart of accounts (G/L accounts)", bucket: "setup", group: "Setup" },
  { no: 270, label: "Bank accounts", bucket: "setup", group: "Setup" },
];

export const CATALOG_BY_NO = new Map(CATALOG.map((c) => [c.no, c]));

export const TRANSACTION_GROUPS = ["Accounting", "Sales", "Purchasing", "Bank & inventory"];

// Tables the technical view hides: BC's config package staging area, which
// holds rows loaded but not yet applied to real business tables.
export const STAGING_TABLES = new Set([8610, 8611, 8612, 8613, 8614, 8615, 8616, 8617, 8618]);
