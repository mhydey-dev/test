// Mock data for TrustLayer — AI On-Chain Identity & Reputation

export type TrustTier = "Excellent" | "Good" | "Fair" | "Building";

export interface ScoreBreakdownItem {
  category: string;
  weight: number; // out of 100
  value: number;  // 0-1000 contribution scaled
  color: string;  // semantic token reference
}

export interface ScorePoint {
  date: string;     // ISO short
  score: number;
  event?: string;   // optional annotation
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
  accessedAt: string;       // relative
  paid: number;             // USDC
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
}

export type ProofStatus = "active" | "expired" | "revoked" | "pending";

export interface IssuedProof {
  id: string;
  templateId: string;
  template: string;
  predicate: string;
  category: "Credit" | "Risk" | "Identity" | "Activity";
  issuedAt: string;          // human readable
  issuedAtMs: number;        // for sorting
  expiresAt: string;         // human readable
  expiresInDays: number;     // negative if expired
  consumer?: string;
  consumerCategory?: string;
  status: ProofStatus;
  proofHash: string;
  verifications: number;
  size: string;              // e.g. "2.4 KB"
  zkSystem: "Groth16" | "PLONK" | "Halo2";
}

export const MAIN_SCORE = 782;
export const SCORE_TIER: TrustTier = "Excellent";
export const SCORE_DELTA_30D = +24;
export const PERCENTILE = 92;

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
  { category: "DeFi Behavior",     weight: 35, value: 285, color: "hsl(var(--primary))" },
  { category: "Wallet History",    weight: 20, value: 168, color: "hsl(var(--info))" },
  { category: "DAO Participation", weight: 15, value: 124, color: "hsl(var(--success))" },
  { category: "NFT Activity",      weight: 12, value: 92,  color: "hsl(var(--warning))" },
  { category: "Social Signals",    weight: 10, value: 78,  color: "hsl(var(--accent-foreground))" },
  { category: "KYC / Attestations",weight:  8, value: 35,  color: "hsl(var(--muted-foreground))" },
];

export const behavioralTags: BehavioralTag[] = [
  { label: "Consistent Repayer",      tone: "positive" },
  { label: "Long-term Holder",        tone: "positive" },
  { label: "Active Governance Voter", tone: "positive" },
  { label: "Diversified Portfolio",   tone: "positive" },
  { label: "Moderate Risk Profile",   tone: "neutral"  },
  { label: "1 Liquidation (May)",     tone: "warning"  },
];

export const dataConsumers: DataConsumer[] = [
  { id: "c1", app: "Aave V3",         category: "Lending",     fields: ["score", "riskProfile"],            accessedAt: "2 hours ago",  paid: 0.45, status: "active" },
  { id: "c2", app: "Compound",        category: "Lending",     fields: ["score", "liquidationHistory"],     accessedAt: "8 hours ago",  paid: 0.38, status: "active" },
  { id: "c3", app: "Snapshot",        category: "Governance",  fields: ["daoParticipation"],                accessedAt: "Yesterday",    paid: 0.12, status: "active" },
  { id: "c4", app: "OpenSea Pro",     category: "NFT",         fields: ["nftActivity", "walletAge"],        accessedAt: "2 days ago",   paid: 0.22, status: "active" },
  { id: "c5", app: "Lens Protocol",   category: "Social",      fields: ["socialSignals"],                   accessedAt: "3 days ago",   paid: 0.08, status: "active" },
  { id: "c6", app: "GMX",             category: "Perps",       fields: ["score", "riskProfile"],            accessedAt: "5 days ago",   paid: 0.55, status: "active" },
  { id: "c7", app: "ENS Marketplace", category: "Identity",    fields: ["walletAge"],                       accessedAt: "1 week ago",   paid: 0.05, status: "revoked" },
  { id: "c8", app: "Maker DAO",       category: "Lending",     fields: ["score", "repaymentHistory"],       accessedAt: "1 week ago",   paid: 0.42, status: "active" },
];

export const earningsByMonth: EarningsPoint[] = [
  { month: "Jul", earnings: 12.4 },
  { month: "Aug", earnings: 18.9 },
  { month: "Sep", earnings: 22.1 },
  { month: "Oct", earnings: 28.7 },
  { month: "Nov", earnings: 34.2 },
  { month: "Dec", earnings: 41.8 },
];

export const TOTAL_EARNINGS = earningsByMonth.reduce((a, p) => a + p.earnings, 0);

export const permissions: PermissionRow[] = [
  { id: "p1", field: "Trust Score",        description: "Your aggregate 0–1000 reputation score", enabled: true,  pricePerQuery: 0.10 },
  { id: "p2", field: "Risk Profile",       description: "Low / medium / high risk classification",enabled: true,  pricePerQuery: 0.15 },
  { id: "p3", field: "Repayment History",  description: "Loan repayment timeliness signals",      enabled: true,  pricePerQuery: 0.20 },
  { id: "p4", field: "Liquidation History",description: "Number and recency of liquidations",     enabled: true,  pricePerQuery: 0.15 },
  { id: "p5", field: "DAO Participation",  description: "Voting frequency and proposal authoring",enabled: true,  pricePerQuery: 0.05 },
  { id: "p6", field: "NFT Activity",       description: "Holdings and trading behavior",          enabled: false, pricePerQuery: 0.08 },
  { id: "p7", field: "Social Signals",     description: "Linked GitHub / Twitter reputation",     enabled: false, pricePerQuery: 0.06 },
  { id: "p8", field: "KYC Attestations",   description: "Verified identity attestations (no PII)",enabled: false, pricePerQuery: 0.30 },
];

export const zkTemplates: ZkProofTemplate[] = [
  { id: "z1", title: "Score Above Threshold", description: "Prove your trust score exceeds a value without revealing it.", predicate: "score > 700", category: "Credit" },
  { id: "z2", title: "Never Liquidated",      description: "Prove you have zero liquidations in the past 12 months.",     predicate: "liquidations(12mo) == 0", category: "Risk" },
  { id: "z3", title: "Wallet Age",            description: "Prove your wallet is older than N months.",                   predicate: "walletAge > 24mo", category: "Identity" },
  { id: "z4", title: "Active Governance",     description: "Prove you've voted in at least N DAO proposals.",             predicate: "daoVotes >= 10", category: "Activity" },
  { id: "z5", title: "Repayment Streak",      description: "Prove a clean repayment record over a window.",               predicate: "onTimeRepayments >= 5", category: "Credit" },
  { id: "z6", title: "Unique Human",          description: "Prove this wallet is sybil-resistant via clustering.",        predicate: "sybilScore < 0.1", category: "Identity" },
];

// Build a richer issued proofs dataset (40 entries) for list/search/filter/pagination.
const PROOF_TEMPLATES: { id: string; title: string; predicate: string; category: IssuedProof["category"] }[] = [
  { id: "z1", title: "Score Above Threshold", predicate: "score > 700",            category: "Credit" },
  { id: "z2", title: "Never Liquidated",      predicate: "liquidations(12mo) == 0",category: "Risk" },
  { id: "z3", title: "Wallet Age",            predicate: "walletAge > 24mo",       category: "Identity" },
  { id: "z4", title: "Active Governance",     predicate: "daoVotes >= 10",         category: "Activity" },
  { id: "z5", title: "Repayment Streak",      predicate: "onTimeRepayments >= 5",  category: "Credit" },
  { id: "z6", title: "Unique Human",          predicate: "sybilScore < 0.1",       category: "Identity" },
];

const CONSUMER_POOL: { app: string; category: string }[] = [
  { app: "Aave V3",         category: "Lending" },
  { app: "Compound",        category: "Lending" },
  { app: "Snapshot",        category: "Governance" },
  { app: "OpenSea Pro",     category: "NFT" },
  { app: "Lens Protocol",   category: "Social" },
  { app: "GMX",             category: "Perps" },
  { app: "ENS Marketplace", category: "Identity" },
  { app: "Maker DAO",       category: "Lending" },
  { app: "Uniswap",         category: "DEX" },
  { app: "dYdX",            category: "Perps" },
  { app: "Tally",           category: "Governance" },
  { app: "Friend.tech",     category: "Social" },
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

    const consumer = i % 5 === 0 ? undefined : CONSUMER_POOL[i % CONSUMER_POOL.length];
    const issuedAtMs = now - issuedDaysAgo * dayMs;

    proofs.push({
      id: `ip${(i + 1).toString().padStart(3, "0")}`,
      templateId: tpl.id,
      template: tpl.title,
      predicate: tpl.predicate,
      category: tpl.category,
      issuedAt: relativeTime(issuedDaysAgo),
      issuedAtMs,
      expiresAt: expiresInDays >= 0 ? `in ${expiresInDays} days` : `${Math.abs(expiresInDays)} days ago`,
      expiresInDays,
      consumer: consumer?.app,
      consumerCategory: consumer?.category,
      status,
      proofHash: makeProofHash(i + 1),
      verifications: status === "active" ? (i * 7) % 48 : status === "expired" ? (i * 3) % 12 : 0,
      size: `${(1.8 + ((i * 0.13) % 1.4)).toFixed(1)} KB`,
      zkSystem: ZK_SYSTEMS[i % ZK_SYSTEMS.length],
    });
  }
  return proofs;
}

export const issuedProofs: IssuedProof[] = buildIssuedProofs();

// ----- Ask Your Data canned answers -----

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
