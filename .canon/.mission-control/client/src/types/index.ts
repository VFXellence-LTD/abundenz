// --- Taxonomy Hierarchy -------------------------------------------
// Empire > Ecosystem > Vertical > Band > Listing > Stream
//
// ECOSYSTEM  = business model         (Viral, Content, Products, Affiliate)
// VERTICAL   = topic niche            (Tech, Kitchen, Finance)
// BAND       = price tier             (Impulse, Recurring, Premium)
// LISTING    = individual product     (Notion, MagSafe Mount, Shopify)
// STREAM     = revenue mechanism      (COM, REC, RPM, MAR, SPO, SUB, LIC)

// --- Ecosystems ---------------------------------------------------

export type EcosystemId =
  | "content"
  | "viral"
  | "products"
  | "affiliate";

export type EcosystemCodename = "Content" | "Viral" | "Products" | "Affiliate";

export type EcosystemStatus = "Active" | "Parked" | "Design";

export interface Ecosystem {
  id: EcosystemId;
  name: string;
  codename: EcosystemCodename;
  status: EcosystemStatus;
  phase: string;
  nextAction: string;
  accentColor: string;
  dotColor: string;
}

// --- Verticals ----------------------------------------------------

export type VerticalId = string; // extensible — new verticals added without type changes

export interface Vertical {
  id: VerticalId;
  name: string;
  ecosystems: EcosystemId[];
  status: "active" | "planned" | "parked";
}

// --- Bands --------------------------------------------------------

export type BandId = "impulse" | "recurring" | "premium";

export interface Band {
  id: BandId;
  name: string;
  alias: string;
  priceRange: string;
  description: string;
}

// --- Listings -----------------------------------------------------

export type ListingStatus = "active" | "testing" | "retired";

export interface Listing {
  id: string;
  name: string;
  ecosystems: EcosystemId[];
  vertical: VerticalId;
  band: BandId;
  platform: string;
  stream: RevenueStreamId;
  commission: string;
  cookie?: string;
  status: ListingStatus;
  estRevPerUnit?: string;
  url?: string;
  notes?: string;
}

// --- Streams (Revenue Types) --------------------------------------

export type RevenueStreamId =
  | "com"   // Commission — one-time affiliate payout per sale
  | "rec"   // Recurring — monthly/annual affiliate payout that repeats
  | "rpm"   // RPM — platform ad revenue per 1000 views
  | "mar"   // Margin — profit on products you sell (price - COGS)
  | "spo"   // Sponsorship — flat fee for featuring a brand
  | "sub"   // Subscription — recurring payment from audience to you
  | "lic";  // Licensing — ongoing royalty from created content/products

export type ExpenseStreamId =
  | "subscriptions"
  | "tools"
  | "contractors"
  | "advertising"
  | "hosting"
  | "education"
  | "equipment"
  | "home_office"
  | "other";

export type StreamId = RevenueStreamId | ExpenseStreamId;

// --- Transactions -------------------------------------------------

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  ecosystemId: EcosystemId;
  stream: StreamId;
  vertical?: VerticalId;
  band?: BandId;
  listingId?: string;
  description: string;
  type: TransactionType;
}

// --- Setup --------------------------------------------------------

export type StepStatus = "pending" | "complete" | "locked";

export interface CopyBlock {
  label: string;
  content: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export type SetupFieldType = "text" | "url" | "email" | "textarea";

export interface SetupField {
  key: string;
  label: string;
  type: SetupFieldType;
  placeholder?: string;
}

export interface SetupStep {
  id: string;
  ecosystemId: EcosystemId;
  order: number;
  title: string;
  description: string;
  instructions: string;
  copyBlocks?: CopyBlock[];
  externalLinks?: ExternalLink[];
  fields?: SetupField[];
}

// --- Tools --------------------------------------------------------

export type ToolStatus = "active" | "candidate" | "rejected";

export interface Tool {
  id: string;
  name: string;
  costPerMonth: number;
  ecosystems: EcosystemId[];
  status: ToolStatus;
  url?: string;
  notes?: string;
}

// --- Progress -----------------------------------------------------

export interface SetupProgress {
  [stepId: string]: boolean;
}

// --- Entity Registry ----------------------------------------------

export type PlatformId = string;

export interface PlatformAccount {
  platform: string;
  handle: string;
  email: string;
  trackingId?: string;
  status: "active" | "pending" | "not-started";
  notes?: string;
  url?: string;
  maxAccounts?: string;
}

export interface Brand {
  id: string;
  name: string;
  ecosystemId: EcosystemId;
  email: string;
  accounts: PlatformAccount[];
}

export interface Entity {
  llc: string;
  ein: string;
  bank: string;
  phone: string;
  parentBrand: string;
  domain: string;
  brands: Brand[];
  sharedAccounts: PlatformAccount[];
}