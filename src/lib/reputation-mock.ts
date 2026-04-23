// Mock data for TrustLayer — AI On-Chain Identity & Reputation

export type TrustTier = "Excellent" | "Good" | "Fair" | "Building";

export interface ScoreBreakdownItem {
  category: string;
  weight: number; // out of 100
  value: number; // 0-1000 contribution scaled
  color: string; // semantic token reference
}

export interface ScorePoint {
  date: string; // ISO short
  score: number;
  event?: string; // optional annotation
}

export interface BehavioralTag {
  label: string;
  tone: "positive" | "neutral" | "warning";
}

export interface DataConsumer {
  id: string;
  app: string;
  category: string;
  fields: string[];
  accessedAt: string; // relative
  paid: number; // USDC
  status: "active" | "revoked";
}

export interface EarningsPoint {
  month: string;
  earnings: number;
}

export interface PermissionRow {
  id: string;
  field: string;
  description: string;
  enabled: boolean;
  pricePerQuery: number;
}

export interface ZkProofTemplate {
  id: string;
  title: string;
  description: string;
  predicate: string;
  category: "Credit" | "Risk" | "Identity" | "Activity";
  categoryLabel: string; // UX categories (e.g. "X Followers Count")
  groupId: string;
  providerId: string;
  completedCount: number; // number of users who completed this proof
  levelRank: number; // within a group: higher = more advanced / higher tier
}

export type ProofStatus = "active" | "expired" | "revoked" | "pending";

export interface ProofProvider {
  id: string;
  name: string;
  about: string;
  websiteUrl: string;
  brand: "x" | "instagram" | "bank" | "databook";
}

export interface ProofGroup {
  id: string;
  title: string;
  description: string;
  providerId: ProofProvider["id"];
}

export interface ZkProofGroup {
  id: string;
  title: string; // e.g. "X Followers Count"
  description: string;
  providerId: ProofProvider["id"];
  imageUrl: string; // /logos/*.svg
}

export interface IssuedProof {
  id: string;
  templateId: string;
  template: string;
  predicate: string;
  category: "Credit" | "Risk" | "Identity" | "Activity";
  issuedAt: string; // human readable
  issuedAtMs: number; // for sorting
  expiresAt: string; // human readable
  expiresInDays: number; // negative if expired
  consumer?: string;
  consumerCategory?: string;
  status: ProofStatus;
  proofHash: string;
  verifications: number;
  size: string; // e.g. "2.4 KB"
  zkSystem: "Groth16" | "PLONK" | "Halo2";
}

export const MAIN_SCORE = 782;
export const SCORE_TIER: TrustTier = "Excellent";
export const SCORE_DELTA_30D = +24;
export const PERCENTILE = 92;
export const CREDIT_SCORE_OBJECT_ID =
  "0x9d4c3a1b2e8f6d7c1a0b5e4d3c2b1a99887766554433221100ffeeddccbbaa99";

export const scoreHistory: ScorePoint[] = [
  { date: "Jan", score: 612 },
  { date: "Feb", score: 638 },
  { date: "Mar", score: 651, event: "Repaid Aave loan" },
  { date: "Apr", score: 670 },
  { date: "May", score: 645, event: "Liquidation event" },
  { date: "Jun", score: 689 },
  { date: "Jul", score: 712, event: "DAO vote streak" },
  { date: "Aug", score: 728 },
  { date: "Sep", score: 741 },
  { date: "Oct", score: 758, event: "1y wallet age" },
  { date: "Nov", score: 770 },
  { date: "Dec", score: 782 },
];

export const scoreBreakdown: ScoreBreakdownItem[] = [
  {
    category: "DeFi Behavior",
    weight: 35,
    value: 285,
    color: "hsl(var(--primary))",
  },
  {
    category: "Wallet History",
    weight: 20,
    value: 168,
    color: "hsl(var(--info))",
  },
  {
    category: "DAO Participation",
    weight: 15,
    value: 124,
    color: "hsl(var(--success))",
  },
  {
    category: "NFT Activity",
    weight: 12,
    value: 92,
    color: "hsl(var(--warning))",
  },
  {
    category: "Social Signals",
    weight: 10,
    value: 78,
    color: "hsl(var(--accent-foreground))",
  },
  {
    category: "KYC / Attestations",
    weight: 8,
    value: 35,
    color: "hsl(var(--muted-foreground))",
  },
];

export const behavioralTags: BehavioralTag[] = [
  { label: "Consistent Repayer", tone: "positive" },
  { label: "Long-term Holder", tone: "positive" },
  { label: "Active Governance Voter", tone: "positive" },
  { label: "Diversified Portfolio", tone: "positive" },
  { label: "Moderate Risk Profile", tone: "neutral" },
  { label: "1 Liquidation (May)", tone: "warning" },
];

export const dataConsumers: DataConsumer[] = [
  {
    id: "c1",
    app: "Aave V3",
    category: "Lending",
    fields: ["score", "riskProfile"],
    accessedAt: "2 hours ago",
    paid: 0.45,
    status: "active",
  },
  {
    id: "c2",
    app: "Compound",
    category: "Lending",
    fields: ["score", "liquidationHistory"],
    accessedAt: "8 hours ago",
    paid: 0.38,
    status: "active",
  },
  {
    id: "c3",
    app: "Snapshot",
    category: "Governance",
    fields: ["daoParticipation"],
    accessedAt: "Yesterday",
    paid: 0.12,
    status: "active",
  },
  {
    id: "c4",
    app: "OpenSea Pro",
    category: "NFT",
    fields: ["nftActivity", "walletAge"],
    accessedAt: "2 days ago",
    paid: 0.22,
    status: "active",
  },
  {
    id: "c5",
    app: "Lens Protocol",
    category: "Social",
    fields: ["socialSignals"],
    accessedAt: "3 days ago",
    paid: 0.08,
    status: "active",
  },
  {
    id: "c6",
    app: "GMX",
    category: "Perps",
    fields: ["score", "riskProfile"],
    accessedAt: "5 days ago",
    paid: 0.55,
    status: "active",
  },
  {
    id: "c7",
    app: "ENS Marketplace",
    category: "Identity",
    fields: ["walletAge"],
    accessedAt: "1 week ago",
    paid: 0.05,
    status: "revoked",
  },
  {
    id: "c8",
    app: "Maker DAO",
    category: "Lending",
    fields: ["score", "repaymentHistory"],
    accessedAt: "1 week ago",
    paid: 0.42,
    status: "active",
  },
];

export const earningsByMonth: EarningsPoint[] = [
  { month: "Jul", earnings: 12.4 },
  { month: "Aug", earnings: 18.9 },
  { month: "Sep", earnings: 22.1 },
  { month: "Oct", earnings: 28.7 },
  { month: "Nov", earnings: 34.2 },
  { month: "Dec", earnings: 41.8 },
];

export const TOTAL_EARNINGS = earningsByMonth.reduce(
  (a, p) => a + p.earnings,
  0,
);

export const permissions: PermissionRow[] = [
  {
    id: "p1",
    field: "Credit Score",
    description: "Your aggregate 0–1000 reputation score",
    enabled: true,
    pricePerQuery: 0.1,
  },
  {
    id: "p2",
    field: "Risk Profile",
    description: "Low / medium / high risk classification",
    enabled: true,
    pricePerQuery: 0.15,
  },
  {
    id: "p3",
    field: "Repayment History",
    description: "Loan repayment timeliness signals",
    enabled: true,
    pricePerQuery: 0.2,
  },
  {
    id: "p4",
    field: "Liquidation History",
    description: "Number and recency of liquidations",
    enabled: true,
    pricePerQuery: 0.15,
  },
  {
    id: "p5",
    field: "DAO Participation",
    description: "Voting frequency and proposal authoring",
    enabled: true,
    pricePerQuery: 0.05,
  },
  {
    id: "p6",
    field: "NFT Activity",
    description: "Holdings and trading behavior",
    enabled: false,
    pricePerQuery: 0.08,
  },
  {
    id: "p7",
    field: "Social Signals",
    description: "Linked GitHub / Twitter reputation",
    enabled: false,
    pricePerQuery: 0.06,
  },
  {
    id: "p8",
    field: "KYC Attestations",
    description: "Verified identity attestations (no PII)",
    enabled: false,
    pricePerQuery: 0.3,
  },
];

export const proofProviders: ProofProvider[] = [
  {
    id: "prov-databook",
    name: "Databook",
    about: "On-chain reputation engine and ZK proof issuer.",
    websiteUrl: "https://databook.xyz",
    brand: "databook",
  },
  {
    id: "prov-x",
    name: "X",
    about: "Social account attestations (followers, age, and engagement).",
    websiteUrl: "https://x.com",
    brand: "x",
  },
  {
    id: "prov-instagram",
    name: "Instagram",
    about: "Social account attestations (followers, account age).",
    websiteUrl: "https://instagram.com",
    brand: "instagram",
  },
  {
    id: "prov-bank",
    name: "Bank Attestor",
    about: "Balance and income proofs via bank aggregation (no PII disclosed).",
    websiteUrl: "https://example.com/bank-attestor",
    brand: "bank",
  },
];

export const zkTemplates: ZkProofTemplate[] = [
  {
    id: "z1",
    title: "Score Above Threshold",
    description:
      "Prove your credit score exceeds a value without revealing it.",
    predicate: "score > 700",
    category: "Credit",
    categoryLabel: "Bank Credit Score",
    groupId: "grp-credit-score",
    providerId: "prov-databook",
    completedCount: 18423,
    levelRank: 1,
  },
  {
    id: "z2",
    title: "Never Liquidated",
    description: "Prove you have zero liquidations in the past 12 months.",
    predicate: "liquidations(12mo) == 0",
    category: "Risk",
    categoryLabel: "Risk Profile",
    groupId: "grp-risk",
    providerId: "prov-databook",
    completedCount: 9122,
    levelRank: 1,
  },
  {
    id: "z3",
    title: "Wallet Age",
    description: "Prove your wallet is older than N months.",
    predicate: "walletAge > 24mo",
    category: "Identity",
    categoryLabel: "Identity",
    groupId: "grp-identity",
    providerId: "prov-databook",
    completedCount: 32781,
    levelRank: 2,
  },
  {
    id: "z4",
    title: "Active Governance",
    description: "Prove you've voted in at least N DAO proposals.",
    predicate: "daoVotes >= 10",
    category: "Activity",
    categoryLabel: "On-chain Activity",
    groupId: "grp-risk",
    providerId: "prov-databook",
    completedCount: 5430,
    levelRank: 1,
  },
  {
    id: "z5",
    title: "Repayment Streak",
    description: "Prove a clean repayment record over a window.",
    predicate: "onTimeRepayments >= 5",
    category: "Credit",
    categoryLabel: "Creditworthiness",
    groupId: "grp-risk",
    providerId: "prov-databook",
    completedCount: 6114,
    levelRank: 2,
  },
  {
    id: "z6",
    title: "Unique Human",
    description: "Prove this wallet is sybil-resistant via clustering.",
    predicate: "sybilScore < 0.1",
    category: "Identity",
    categoryLabel: "Sybil Resistance",
    groupId: "grp-identity",
    providerId: "prov-databook",
    completedCount: 15507,
    levelRank: 3,
  },
  {
    id: "z7",
    title: "X Followers ≥ 1k",
    description: "Prove your X account has at least 1,000 followers.",
    predicate: "xFollowers >= 1_000",
    category: "Activity",
    categoryLabel: "X Followers Count",
    groupId: "grp-x-followers",
    providerId: "prov-x",
    completedCount: 40211,
    levelRank: 1,
  },
  {
    id: "z8",
    title: "X Followers ≥ 2k",
    description: "Prove your X account has at least 2,000 followers.",
    predicate: "xFollowers >= 2_000",
    category: "Activity",
    categoryLabel: "X Followers Count",
    groupId: "grp-x-followers",
    providerId: "prov-x",
    completedCount: 26102,
    levelRank: 2,
  },
  {
    id: "z9",
    title: "X Followers ≥ 5k",
    description: "Prove your X account has at least 5,000 followers.",
    predicate: "xFollowers >= 5_000",
    category: "Activity",
    categoryLabel: "X Followers Count",
    groupId: "grp-x-followers",
    providerId: "prov-x",
    completedCount: 13988,
    levelRank: 3,
  },
  {
    id: "z10",
    title: "X Account Age ≥ 1 year",
    description: "Prove your X account is at least 1 year old.",
    predicate: "xAccountAge >= 12mo",
    category: "Identity",
    categoryLabel: "X Account Age",
    groupId: "grp-x-age",
    providerId: "prov-x",
    completedCount: 198004,
    levelRank: 1,
  },
  {
    id: "z11",
    title: "X Account Age ≥ 2 years",
    description: "Prove your X account is at least 2 years old.",
    predicate: "xAccountAge >= 24mo",
    category: "Identity",
    categoryLabel: "X Account Age",
    groupId: "grp-x-age",
    providerId: "prov-x",
    completedCount: 121443,
    levelRank: 2,
  },
  {
    id: "z12",
    title: "Instagram Followers ≥ 1k",
    description: "Prove your Instagram has at least 1,000 followers.",
    predicate: "igFollowers >= 1_000",
    category: "Activity",
    categoryLabel: "Instagram Followers Count",
    groupId: "grp-instagram-followers",
    providerId: "prov-instagram",
    completedCount: 18822,
    levelRank: 1,
  },
  {
    id: "z13",
    title: "Instagram Followers ≥ 5k",
    description: "Prove your Instagram has at least 5,000 followers.",
    predicate: "igFollowers >= 5_000",
    category: "Activity",
    categoryLabel: "Instagram Followers Count",
    groupId: "grp-instagram-followers",
    providerId: "prov-instagram",
    completedCount: 6514,
    levelRank: 2,
  },
  {
    id: "z14",
    title: "Instagram Account Age ≥ 1 year",
    description: "Prove your Instagram account is at least 1 year old.",
    predicate: "igAccountAge >= 12mo",
    category: "Identity",
    categoryLabel: "Instagram Account Age",
    groupId: "grp-instagram-age",
    providerId: "prov-instagram",
    completedCount: 45602,
    levelRank: 1,
  },
  {
    id: "z15",
    title: "Bank Balance ≥ $100",
    description: "Prove your bank balance is at least $100.",
    predicate: "bankBalance >= 100",
    category: "Credit",
    categoryLabel: "Bank Account Balance",
    groupId: "grp-bank-balance",
    providerId: "prov-bank",
    completedCount: 3221,
    levelRank: 1,
  },
  {
    id: "z16",
    title: "Bank Balance ≥ $1k",
    description: "Prove your bank balance is at least $1,000.",
    predicate: "bankBalance >= 1_000",
    category: "Credit",
    categoryLabel: "Bank Account Balance",
    groupId: "grp-bank-balance",
    providerId: "prov-bank",
    completedCount: 1983,
    levelRank: 2,
  },
  {
    id: "z17",
    title: "Bank Balance ≥ $100k",
    description: "Prove your bank balance is at least $100,000.",
    predicate: "bankBalance >= 100_000",
    category: "Credit",
    categoryLabel: "Bank Account Balance",
    groupId: "grp-bank-balance",
    providerId: "prov-bank",
    completedCount: 212,
    levelRank: 3,
  },
  {
    id: "z18",
    title: "YouTube Subscribers ≥ 1k",
    description: "Prove your YouTube channel has at least 1,000 subscribers.",
    predicate: "ytSubscribers >= 1_000",
    category: "Activity",
    categoryLabel: "YouTube Subscribe",
    groupId: "grp-identity",
    providerId: "prov-databook",
    completedCount: 7402,
    levelRank: 1,
  },
  {
    id: "z19",
    title: "YouTube Likes ≥ 10k",
    description: "Prove your channel has at least 10,000 lifetime likes.",
    predicate: "ytLikes >= 10_000",
    category: "Activity",
    categoryLabel: "YouTube Liked",
    groupId: "grp-identity",
    providerId: "prov-databook",
    completedCount: 3104,
    levelRank: 2,
  },
  {
    id: "z20",
    title: "Land Ownership",
    description: "Prove you own land without revealing parcel identity.",
    predicate: "ownsLand == true",
    category: "Identity",
    categoryLabel: "Land Ownership",
    groupId: "grp-identity",
    providerId: "prov-databook",
    completedCount: 182,
    levelRank: 1,
  },
  {
    id: "z21",
    title: "Student Status",
    description: "Prove you are a student (no institution disclosed).",
    predicate: "isStudent == true",
    category: "Identity",
    categoryLabel: "Student",
    groupId: "grp-identity",
    providerId: "prov-databook",
    completedCount: 812,
    levelRank: 1,
  },
  {
    id: "z22",
    title: "Gender Proof",
    description: "Prove a gender attribute without revealing identity.",
    predicate: "gender in {F, M, X}",
    category: "Identity",
    categoryLabel: "Gender",
    groupId: "grp-identity",
    providerId: "prov-databook",
    completedCount: 354,
    levelRank: 1,
  },
];

export const proofGroups: ProofGroup[] = [
  {
    id: "grp-credit-score",
    title: "Credit score tiers",
    description: "Prove score thresholds without revealing your score.",
    providerId: "prov-databook",
  },
  {
    id: "grp-x-followers",
    title: "X follower tiers",
    description: "Prove follower milestones for X accounts.",
    providerId: "prov-x",
  },
  {
    id: "grp-x-age",
    title: "X account age",
    description: "Prove the age of your X account.",
    providerId: "prov-x",
  },
  {
    id: "grp-instagram-followers",
    title: "Instagram follower tiers",
    description: "Prove follower milestones for Instagram accounts.",
    providerId: "prov-instagram",
  },
  {
    id: "grp-instagram-age",
    title: "Instagram account age",
    description: "Prove the age of your Instagram account.",
    providerId: "prov-instagram",
  },
  {
    id: "grp-bank-balance",
    title: "Bank balance tiers",
    description: "Prove balance thresholds without revealing exact balances.",
    providerId: "prov-bank",
  },
  {
    id: "grp-risk",
    title: "Risk & behavior",
    description: "Prove risk signals like liquidations or repayment streaks.",
    providerId: "prov-databook",
  },
  {
    id: "grp-identity",
    title: "Identity & sybil",
    description: "Prove identity signals like wallet age or uniqueness.",
    providerId: "prov-databook",
  },
];

function groupIdFromTitle(title: string) {
  return (
    "g_" +
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
  );
}

function groupImageForTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("x ")) return "/logos/x.svg";
  if (t.startsWith("x ")) return "/logos/x.svg";
  if (t.includes("instagram")) return "/logos/instagram.svg";
  if (t.includes("youtube")) return "/logos/youtube.svg";
  if (t.includes("bank")) return "/logos/bank.svg";
  return "/logos/databook.svg";
}

function groupProviderForTitle(title: string): ProofProvider["id"] {
  const t = title.toLowerCase();
  if (t.includes("x ")) return "prov-x";
  if (t.startsWith("x ")) return "prov-x";
  if (t.includes("instagram")) return "prov-instagram";
  if (t.includes("youtube")) return "prov-databook";
  if (t.includes("bank")) return "prov-bank";
  return "prov-databook";
}

export const zkProofGroups: ZkProofGroup[] = (() => {
  const labels = Array.from(new Set(zkTemplates.map((t) => t.categoryLabel)));
  return labels
    .map((title) => ({
      id: groupIdFromTitle(title),
      title,
      description: "Zero-knowledge proofs grouped by level.",
      providerId: groupProviderForTitle(title),
      imageUrl: groupImageForTitle(title),
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
})();

export const zkProofTemplatesByGroupId: Record<string, ZkProofTemplate[]> =
  (() => {
    const map: Record<string, ZkProofTemplate[]> = {};
    for (const g of zkProofGroups) map[g.id] = [];
    for (const t of zkTemplates) {
      const gid = groupIdFromTitle(t.categoryLabel);
      (map[gid] ??= []).push(t);
    }
    for (const gid of Object.keys(map)) {
      map[gid] = map[gid].slice().sort((a, b) => a.levelRank - b.levelRank);
    }
    return map;
  })();

// Build a richer issued proofs dataset (40 entries) for list/search/filter/pagination.
const PROOF_TEMPLATES: {
  id: string;
  title: string;
  predicate: string;
  category: IssuedProof["category"];
}[] = [
  ...zkTemplates.map((t) => ({
    id: t.id,
    title: t.title,
    predicate: t.predicate,
    category: t.category as IssuedProof["category"],
  })),
];

const CONSUMER_POOL: { app: string; category: string }[] = [
  { app: "Aave V3", category: "Lending" },
  { app: "Compound", category: "Lending" },
  { app: "Snapshot", category: "Governance" },
  { app: "OpenSea Pro", category: "NFT" },
  { app: "Lens Protocol", category: "Social" },
  { app: "GMX", category: "Perps" },
  { app: "ENS Marketplace", category: "Identity" },
  { app: "Maker DAO", category: "Lending" },
  { app: "Uniswap", category: "DEX" },
  { app: "dYdX", category: "Perps" },
  { app: "Tally", category: "Governance" },
  { app: "Friend.tech", category: "Social" },
];

const ZK_SYSTEMS: IssuedProof["zkSystem"][] = ["Groth16", "PLONK", "Halo2"];

function makeProofId(seed: number): string {
  const hex = (seed * 9301 + 49297) % 233280;
  const slug = hex.toString(16).padStart(6, "0");
  return `zkp_${slug}${(seed * 7).toString(16).padStart(2, "0")}`;
}

function makeProofHash(seed: number): string {
  let h = "0x";
  for (let i = 0; i < 32; i++) {
    h += (((seed + i) * 2654435761) % 16).toString(16);
  }
  return h;
}

function relativeTime(daysAgo: number): string {
  if (daysAgo < 1) return "Today";
  if (daysAgo === 1) return "Yesterday";
  if (daysAgo < 7) return `${daysAgo} days ago`;
  if (daysAgo < 14) return "1 week ago";
  if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} weeks ago`;
  if (daysAgo < 60) return "1 month ago";
  return `${Math.floor(daysAgo / 30)} months ago`;
}

function buildIssuedProofs(): IssuedProof[] {
  const now = Date.now();
  const dayMs = 86_400_000;
  const proofs: IssuedProof[] = [];

  for (let i = 0; i < 40; i++) {
    const tpl = PROOF_TEMPLATES[i % PROOF_TEMPLATES.length];
    const issuedDaysAgo = Math.floor((i * 3 + (i % 4)) * 1.1) + 1;
    const lifetime = 30; // most proofs have 30d lifetime
    const expiresInDays = lifetime - issuedDaysAgo;

    let status: ProofStatus;
    if (i % 13 === 0) status = "revoked";
    else if (expiresInDays < 0) status = "expired";
    else if (i % 17 === 0) status = "pending";
    else status = "active";

    const consumer =
      i % 5 === 0 ? undefined : CONSUMER_POOL[i % CONSUMER_POOL.length];
    const issuedAtMs = now - issuedDaysAgo * dayMs;

    proofs.push({
      id: `ip${(i + 1).toString().padStart(3, "0")}`,
      templateId: tpl.id,
      template: tpl.title,
      predicate: tpl.predicate,
      category: tpl.category,
      issuedAt: relativeTime(issuedDaysAgo),
      issuedAtMs,
      expiresAt:
        expiresInDays >= 0
          ? `in ${expiresInDays} days`
          : `${Math.abs(expiresInDays)} days ago`,
      expiresInDays,
      consumer: consumer?.app,
      consumerCategory: consumer?.category,
      status,
      proofHash: makeProofHash(i + 1),
      verifications:
        status === "active"
          ? (i * 7) % 48
          : status === "expired"
            ? (i * 3) % 12
            : 0,
      size: `${(1.8 + ((i * 0.13) % 1.4)).toFixed(1)} KB`,
      zkSystem: ZK_SYSTEMS[i % ZK_SYSTEMS.length],
    });
  }
  return proofs;
}

export const issuedProofs: IssuedProof[] = buildIssuedProofs();

// ----- Persona canned answers -----

export interface AiInsight {
  question: string;
  answer: string;
}

export const aiSuggestions: string[] = [
  "Why did my score drop last week?",
  "How can I improve my DeFi credit score?",
  "Which activity contributes most to my reputation?",
  "What apps have queried my data recently?",
  "Am I at risk of being flagged as sybil?",
];

export const cannedAnswers: AiInsight[] = [
  {
    question: "Why did my score drop last week?",
    answer:
      "Your score dropped by 13 points in May after a small liquidation on Aave. The impact has mostly recovered — over the last 7 months you've added +137 points through consistent repayments and DAO participation.",
  },
  {
    question: "How can I improve my DeFi credit score?",
    answer:
      "Three high-impact actions:\n\n1. **Maintain on-time repayments** — your repayment streak is currently 14. Keeping it past 25 unlocks the next tier.\n2. **Diversify protocol exposure** — you're 68% concentrated in Aave. Spreading across 3+ blue-chip protocols boosts your behavior score.\n3. **Link a verified social** — adding a GitHub or ENS attestation would add ~18 points to your social signals component.",
  },
  {
    question: "Which activity contributes most to my reputation?",
    answer:
      "Your DeFi behavior accounts for **35% of your score (285 points)**. The largest single contributor is your repayment history on Aave V3, followed by your wallet age (3.2 years) and your DAO voting consistency in Uniswap and ENS governance.",
  },
];
