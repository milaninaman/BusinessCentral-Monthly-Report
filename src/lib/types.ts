export type TableRow = { no: number; name: string; records: number };

export type SnapshotCompany = {
  bcName: string;
  tablesInBc: number;
  sizeKb: number;
  tables: TableRow[];
};

export type Snapshot = {
  month: string;
  sourceFile: string;
  importedOn: string;
  companies: SnapshotCompany[];
};

export type StepState = "done" | "current" | "todo";

export type Project = {
  id: string;
  name: string;
  status: "live" | "testing" | "in-progress" | "blocked";
  statusLabel: string;
  summary: string;
  impact: string;
  steps: { label: string; state: StepState }[];
  details: string[];
  link?: { label: string; url: string; password?: string };
};

export type AttentionItem = {
  kind: "decision" | "dependency" | "risk";
  title: string;
  detail: string;
};

export type Notes = {
  summary: string[];
  projects: Project[];
  attention: AttentionItem[];
};

export type MonthData = { month: string; snapshot: Snapshot; notes: Notes };

export type CompanyInfo = { bcName: string; name: string; slug: string };
