// Mock data for Databook — AI On-Chain Identity & Reputation

export type TrustTier = "Excellent" | "Good" | "Fair" | "Building";

export interface ScoreBreakdownItem {
  category: string;
  weight: number;
  value: number;
  color: string;
}

export interface ScorePoint {
  date: string;
  score: number;
  event?: string;
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
  accessedAt: string;
  paid: number;
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

export interface ProofProvider {
  id: string;
  name: string;
  about: string;
  websiteUrl: string;
  imageUrl: string;
}

/**
 * A ZK Proof Group is the parent verifiable claim.
 * The "level" inside a group represents how strong the user's status is
 * (e.g. "Bank Balance Above $20" → "$1k" → "$100k").
 * Generating a higher level deactivates lower levels (technical less / dominated).
 * Revoking the group unlocks all levels again.
 */
export interface ZkProofLevel {
  id: string;
  groupId: string;
  rank: number; // 1..N (higher = stronger)
  /** Human, readable name shown in UI: e.g. "Bank Balance Above $20" */
  name: string;
  /** Short helper description */
  description: string;
  /** Predicate evaluated by ZK circuit */
  predicate: string;
  /** Number of users who have completed this level */
  completedCount: number;
}

export interface ZkProofGroup {
  id: string;
  /** Parent group title, e.g. "Bank Balance" */
  title: string;
  /** Short subtitle */
  subtitle: string;
  providerId: ProofProvider["id"];
  /** Visual badge shown for the category */
  category: "Finance" | "Social" | "Identity" | "Activity";
  /** Real provider image (e.g. /logos/x.png) */
  imageUrl: string;
}

// ---------- Top-level numbers ----------

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
  { category: "DeFi Behavior", weight: 35, value: 285, color: "hsl(var(--primary))" },
  { category: "Wallet History", weight: 20, value: 168, color: "hsl(var(--info))" },
  { category: "DAO Participation", weight: 15, value: 124, color: "hsl(var(--success))" },
  { category: "NFT Activity", weight: 12, value: 92, color: "hsl(var(--warning))" },
  { category: "Social Signals", weight: 10, value: 78, color: "hsl(var(--accent-foreground))" },
  { category: "KYC / Attestations", weight: 8, value: 35, color: "hsl(var(--muted-foreground))" },
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
  { id: "c1", app: "Aave V3", category: "Lending", fields: ["score", "riskProfile"], accessedAt: "2 hours ago", paid: 0.45, status: "active" },
  { id: "c2", app: "Compound", category: "Lending", fields: ["score", "liquidationHistory"], accessedAt: "8 hours ago", paid: 0.38, status: "active" },
  { id: "c3", app: "Snapshot", category: "Governance", fields: ["daoParticipation"], accessedAt: "Yesterday", paid: 0.12, status: "active" },
  { id: "c4", app: "OpenSea Pro", category: "NFT", fields: ["nftActivity", "walletAge"], accessedAt: "2 days ago", paid: 0.22, status: "active" },
  { id: "c5", app: "Lens Protocol", category: "Social", fields: ["socialSignals"], accessedAt: "3 days ago", paid: 0.08, status: "active" },
  { id: "c6", app: "GMX", category: "Perps", fields: ["score", "riskProfile"], accessedAt: "5 days ago", paid: 0.55, status: "active" },
  { id: "c7", app: "ENS Marketplace", category: "Identity", fields: ["walletAge"], accessedAt: "1 week ago", paid: 0.05, status: "revoked" },
  { id: "c8", app: "Maker DAO", category: "Lending", fields: ["score", "repaymentHistory"], accessedAt: "1 week ago", paid: 0.42, status: "active" },
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
  { id: "p1", field: "Credit Score", description: "Your aggregate 0–1000 reputation score", enabled: true, pricePerQuery: 0.1 },
  { id: "p2", field: "Risk Profile", description: "Low / medium / high risk classification", enabled: true, pricePerQuery: 0.15 },
  { id: "p3", field: "Repayment History", description: "Loan repayment timeliness signals", enabled: true, pricePerQuery: 0.2 },
  { id: "p4", field: "Liquidation History", description: "Number and recency of liquidations", enabled: true, pricePerQuery: 0.15 },
  { id: "p5", field: "DAO Participation", description: "Voting frequency and proposal authoring", enabled: true, pricePerQuery: 0.05 },
  { id: "p6", field: "NFT Activity", description: "Holdings and trading behavior", enabled: false, pricePerQuery: 0.08 },
  { id: "p7", field: "Social Signals", description: "Linked GitHub / Twitter reputation", enabled: false, pricePerQuery: 0.06 },
  { id: "p8", field: "KYC Attestations", description: "Verified identity attestations (no PII)", enabled: false, pricePerQuery: 0.3 },
];

// ---------- Providers ----------

export const proofProviders: ProofProvider[] = [
  { id: "prov-databook", name: "Databook", about: "On-chain reputation engine and ZK proof issuer.", websiteUrl: "https://databook.xyz", imageUrl: "/logos/databook.png" },
  { id: "prov-x", name: "X", about: "Social account attestations (followers, age, engagement).", websiteUrl: "https://x.com", imageUrl: "/logos/x.png" },
  { id: "prov-instagram", name: "Instagram", about: "Social account attestations (followers, account age).", websiteUrl: "https://instagram.com", imageUrl: "/logos/instagram.png" },
  { id: "prov-youtube", name: "YouTube", about: "Channel attestations (subscribers, watch time).", websiteUrl: "https://youtube.com", imageUrl: "/logos/youtube.png" },
  { id: "prov-bank", name: "Bank Attestor", about: "Balance and income proofs via bank aggregation (no PII disclosed).", websiteUrl: "https://example.com/bank-attestor", imageUrl: "/logos/bank.png" },
  { id: "prov-land", name: "Land Registry", about: "Verified land ownership without parcel disclosure.", websiteUrl: "https://example.com/land", imageUrl: "/logos/land.png" },
  { id: "prov-edu", name: "Education Verifier", about: "Student / alumni status without institution disclosure.", websiteUrl: "https://example.com/edu", imageUrl: "/logos/student.png" },
  { id: "prov-id", name: "Identity Attestor", about: "Sybil-resistance and identity attributes without PII.", websiteUrl: "https://example.com/id", imageUrl: "/logos/identity.png" },
];

// ---------- Groups + Levels ----------

interface GroupSeed {
  id: string;
  title: string;
  subtitle: string;
  providerId: string;
  category: ZkProofGroup["category"];
  imageUrl: string;
  /** Each tier becomes a level — name is the readable claim shown to the user */
  levels: { name: string; predicate: string; description: string; completedCount: number }[];
}

const GROUP_SEEDS: GroupSeed[] = [
  {
    id: "grp-bank-balance",
    title: "Bank Balance",
    subtitle: "Prove your bank balance exceeds a tier — without revealing it.",
    providerId: "prov-bank",
    category: "Finance",
    imageUrl: "/logos/bank.png",
    levels: [
      { name: "Bank Balance Above $20", predicate: "bankBalance >= 20", description: "Smallest tier — proves a positive bank balance.", completedCount: 12_540 },
      { name: "Bank Balance Above $100", predicate: "bankBalance >= 100", description: "Entry tier for many gated dApps.", completedCount: 8_212 },
      { name: "Bank Balance Above $1k", predicate: "bankBalance >= 1_000", description: "Verified treasury holder tier.", completedCount: 3_104 },
      { name: "Bank Balance Above $10k", predicate: "bankBalance >= 10_000", description: "Verified high-balance tier.", completedCount: 941 },
      { name: "Bank Balance Above $100k", predicate: "bankBalance >= 100_000", description: "Top-tier verified balance.", completedCount: 212 },
    ],
  },
  {
    id: "grp-x-followers",
    title: "X Followers",
    subtitle: "Prove your X (Twitter) follower count meets a milestone.",
    providerId: "prov-x",
    category: "Social",
    imageUrl: "/logos/x.png",
    levels: [
      { name: "X Followers Above 100", predicate: "xFollowers >= 100", description: "Casual creator tier.", completedCount: 84_120 },
      { name: "X Followers Above 1,000", predicate: "xFollowers >= 1_000", description: "Established creator tier.", completedCount: 40_211 },
      { name: "X Followers Above 10,000", predicate: "xFollowers >= 10_000", description: "Notable creator tier.", completedCount: 8_902 },
      { name: "X Followers Above 100,000", predicate: "xFollowers >= 100_000", description: "Top-tier creator tier.", completedCount: 612 },
    ],
  },
  {
    id: "grp-x-age",
    title: "X Account Age",
    subtitle: "Prove your X account has existed for at least N months.",
    providerId: "prov-x",
    category: "Identity",
    imageUrl: "/logos/x.png",
    levels: [
      { name: "X Account Older Than 6 Months", predicate: "xAccountAge >= 6mo", description: "Basic anti-bot signal.", completedCount: 220_004 },
      { name: "X Account Older Than 1 Year", predicate: "xAccountAge >= 12mo", description: "Established account.", completedCount: 198_004 },
      { name: "X Account Older Than 3 Years", predicate: "xAccountAge >= 36mo", description: "Long-term established account.", completedCount: 88_410 },
      { name: "X Account Older Than 5 Years", predicate: "xAccountAge >= 60mo", description: "Veteran account.", completedCount: 31_220 },
    ],
  },
  {
    id: "grp-instagram-followers",
    title: "Instagram Followers",
    subtitle: "Prove your Instagram follower count meets a milestone.",
    providerId: "prov-instagram",
    category: "Social",
    imageUrl: "/logos/instagram.png",
    levels: [
      { name: "Instagram Followers Above 1,000", predicate: "igFollowers >= 1_000", description: "Established creator tier.", completedCount: 18_822 },
      { name: "Instagram Followers Above 10,000", predicate: "igFollowers >= 10_000", description: "Mid-tier creator.", completedCount: 4_212 },
      { name: "Instagram Followers Above 100,000", predicate: "igFollowers >= 100_000", description: "Top-tier creator.", completedCount: 521 },
    ],
  },
  {
    id: "grp-youtube-subs",
    title: "YouTube Subscribers",
    subtitle: "Prove your YouTube channel meets a subscriber milestone.",
    providerId: "prov-youtube",
    category: "Social",
    imageUrl: "/logos/youtube.png",
    levels: [
      { name: "YouTube Subscribers Above 1,000", predicate: "ytSubscribers >= 1_000", description: "Monetization-eligible tier.", completedCount: 7_402 },
      { name: "YouTube Subscribers Above 10,000", predicate: "ytSubscribers >= 10_000", description: "Established channel.", completedCount: 1_902 },
      { name: "YouTube Subscribers Above 100,000", predicate: "ytSubscribers >= 100_000", description: "Silver play button tier.", completedCount: 218 },
      { name: "YouTube Subscribers Above 1,000,000", predicate: "ytSubscribers >= 1_000_000", description: "Gold play button tier.", completedCount: 14 },
    ],
  },
  {
    id: "grp-credit-score",
    title: "Credit Score",
    subtitle: "Prove your aggregated credit score is above a threshold.",
    providerId: "prov-databook",
    category: "Finance",
    imageUrl: "/logos/databook.png",
    levels: [
      { name: "Credit Score Above 500", predicate: "score >= 500", description: "Building reputation tier.", completedCount: 38_120 },
      { name: "Credit Score Above 700", predicate: "score >= 700", description: "Good reputation tier.", completedCount: 18_423 },
      { name: "Credit Score Above 850", predicate: "score >= 850", description: "Excellent reputation tier.", completedCount: 4_122 },
    ],
  },
  {
    id: "grp-land",
    title: "Land Ownership",
    subtitle: "Prove you own land without revealing the parcel.",
    providerId: "prov-land",
    category: "Identity",
    imageUrl: "/logos/land.png",
    levels: [
      { name: "Owns At Least 1 Plot", predicate: "ownsLand == true", description: "Verified land ownership.", completedCount: 1_840 },
      { name: "Owns Plot Worth Above $50k", predicate: "landValue >= 50_000", description: "Verified mid-value land owner.", completedCount: 412 },
      { name: "Owns Plot Worth Above $500k", predicate: "landValue >= 500_000", description: "Verified high-value land owner.", completedCount: 38 },
    ],
  },
  {
    id: "grp-student",
    title: "Student Status",
    subtitle: "Prove you are an active student without disclosing the institution.",
    providerId: "prov-edu",
    category: "Identity",
    imageUrl: "/logos/student.png",
    levels: [
      { name: "Verified Student", predicate: "isStudent == true", description: "Currently enrolled student.", completedCount: 6_812 },
      { name: "Verified University Student", predicate: "studentLevel == 'university'", description: "Higher education student.", completedCount: 3_104 },
    ],
  },
  {
    id: "grp-identity",
    title: "Unique Human",
    subtitle: "Prove this wallet is sybil-resistant and represents a unique human.",
    providerId: "prov-id",
    category: "Identity",
    imageUrl: "/logos/identity.png",
    levels: [
      { name: "Verified Unique Human", predicate: "sybilScore < 0.2", description: "Basic sybil-resistance check.", completedCount: 41_220 },
      { name: "Strongly Unique Human", predicate: "sybilScore < 0.05", description: "Strict sybil-resistance check.", completedCount: 15_507 },
    ],
  },
  {
    id: "grp-defi",
    title: "DeFi Reputation",
    subtitle: "Prove sustained, healthy DeFi behavior on-chain.",
    providerId: "prov-databook",
    category: "Finance",
    imageUrl: "/logos/databook.png",
    levels: [
      { name: "Never Liquidated (12 Months)", predicate: "liquidations(12mo) == 0", description: "No liquidations in the last year.", completedCount: 9_122 },
      { name: "On-Time Repayments ≥ 5", predicate: "onTimeRepayments >= 5", description: "Clean repayment streak.", completedCount: 6_114 },
      { name: "On-Time Repayments ≥ 25", predicate: "onTimeRepayments >= 25", description: "Long clean repayment streak.", completedCount: 1_980 },
    ],
  },
  {
    id: "grp-governance",
    title: "DAO Governance",
    subtitle: "Prove sustained DAO participation without revealing votes.",
    providerId: "prov-databook",
    category: "Activity",
    imageUrl: "/logos/databook.png",
    levels: [
      { name: "Voted in 10+ Proposals", predicate: "daoVotes >= 10", description: "Active governance participant.", completedCount: 5_430 },
      { name: "Voted in 50+ Proposals", predicate: "daoVotes >= 50", description: "Highly active governance participant.", completedCount: 1_810 },
    ],
  },
  {
    id: "grp-wallet-age",
    title: "Wallet Age",
    subtitle: "Prove your wallet is older than N months.",
    providerId: "prov-databook",
    category: "Identity",
    imageUrl: "/logos/databook.png",
    levels: [
      { name: "Wallet Older Than 1 Year", predicate: "walletAge >= 12mo", description: "Established wallet.", completedCount: 78_201 },
      { name: "Wallet Older Than 2 Years", predicate: "walletAge >= 24mo", description: "Long-term wallet.", completedCount: 32_781 },
      { name: "Wallet Older Than 4 Years", predicate: "walletAge >= 48mo", description: "Veteran wallet.", completedCount: 9_410 },
    ],
  },
];

export const zkProofGroups: ZkProofGroup[] = GROUP_SEEDS.map((g) => ({
  id: g.id,
  title: g.title,
  subtitle: g.subtitle,
  providerId: g.providerId,
  category: g.category,
  imageUrl: g.imageUrl,
}));

export const zkProofLevelsByGroupId: Record<string, ZkProofLevel[]> = (() => {
  const map: Record<string, ZkProofLevel[]> = {};
  for (const g of GROUP_SEEDS) {
    map[g.id] = g.levels.map((l, i) => ({
      id: `${g.id}-l${i + 1}`,
      groupId: g.id,
      rank: i + 1,
      name: l.name,
      description: l.description,
      predicate: l.predicate,
      completedCount: l.completedCount,
    }));
  }
  return map;
})();

export const PROOF_CATEGORIES: ZkProofGroup["category"][] = [
  "Finance",
  "Social",
  "Identity",
  "Activity",
];

// ---------- Persona canned answers ----------

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
