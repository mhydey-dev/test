import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  Lock,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Coins,
} from "lucide-react";
import {
  MAIN_SCORE,
  SCORE_TIER,
  SCORE_DELTA_30D,
  PERCENTILE,
  scoreHistory,
  dataConsumers,
  TOTAL_EARNINGS,
  behavioralTags,
} from "@/lib/reputation-mock";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useCreditToken } from "@/hooks/useCreditToken";

const Overview = () => {
  const recentConsumers = dataConsumers.slice(0, 4);
  const token = useCreditToken();

  if (!token.mounted) return null;

  if (!token.minted) {
    return (
      <div className="flex-1 px-4 md:px-8 py-6 md:py-10 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="max-w-3xl">
            <Badge
              variant="outline"
              className="rounded-full border-primary/30 text-primary bg-primary/5 mb-4"
            >
              <Sparkles className="h-3 w-3 mr-1" /> Welcome to Databook
            </Badge>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Your on-chain reputation,
              <br className="hidden sm:block" />
              <span className="text-primary"> tokenized & private.</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl">
              Mint your Credit Score token to unlock your personalized dashboard,
              share verifiable proofs, and start earning from your data.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="rounded-xl gap-2">
                <Link to="/score">
                  <Sparkles className="h-4 w-4" />
                  Mint Credit Score token
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-xl"
              >
                <Link to="/proofs">Explore proofs</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: ShieldCheck,
              title: "Privacy first",
              sub: "Share only what you choose with ZK proofs. Your raw data stays yours.",
            },
            {
              icon: TrendingUp,
              title: "Reputation that grows",
              sub: "Your score evolves with on-chain behavior across DeFi, DAOs, and more.",
            },
            {
              icon: Coins,
              title: "Earn from your data",
              sub: "dApps pay to query your verified data. You stay in control of access.",
            },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="rounded-2xl border-border/60 p-5 h-full">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {b.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {b.sub}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <Card className="rounded-2xl border-border/60 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            How it works
          </p>
          <div className="mt-4 grid sm:grid-cols-3 gap-4">
            {[
              {
                n: 1,
                icon: KeyRound,
                title: "Connect your wallet",
                sub: "Non-custodial. We never touch your keys.",
              },
              {
                n: 2,
                icon: Sparkles,
                title: "Mint your token",
                sub: "One-time, gas only. Updates as you transact.",
              },
              {
                n: 3,
                icon: Lock,
                title: "Generate ZK proofs",
                sub: "Share what's needed without exposing details.",
              },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center border border-primary/20">
                  {s.n}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {s.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {s.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Locked preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Unlocks after minting
            </p>
            <Badge
              variant="outline"
              className="rounded-full text-[10px] gap-1 border-border/60"
            >
              <Lock className="h-3 w-3" /> Locked
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Credit Score", icon: Shield },
              { label: "Earnings", icon: DollarSign },
              { label: "Active Consumers", icon: Activity },
              { label: "Score Trend", icon: TrendingUp },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="rounded-2xl border-border/60 border-dashed p-5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-display text-2xl font-bold text-muted-foreground/40">
                  ——
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Available after mint
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 px-4 md:px-8 py-6  space-y-6">
        {/* Hero score card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="overflow-hidden relative">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <Badge
                  variant="outline"
                  className="rounded-full border-primary/30 text-primary bg-primary/5 mb-4"
                >
                  <Shield className="h-3 w-3 mr-1" /> Tier · {SCORE_TIER}
                </Badge>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-none">
                    {MAIN_SCORE}
                  </span>
                  <span className="text-muted-foreground text-xl sm:text-2xl">/ 1000</span>
                </div>
                <p className="text-muted-foreground mt-3">
                  You're in the top{" "}
                  <span className="text-foreground font-medium">
                    {PERCENTILE}%
                  </span>{" "}
                  of wallets ·
                  <span className="text-success font-medium ml-1">
                    +{SCORE_DELTA_30D} this month
                  </span>
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  {behavioralTags.slice(0, 4).map((t) => (
                    <Badge
                      key={t.label}
                      variant="outline"
                      className={
                        "rounded-full text-xs font-medium " +
                        (t.tone === "positive"
                          ? "border-success/30 bg-success/10 text-success"
                          : t.tone === "warning"
                            ? "border-warning/30 bg-warning/10 text-warning"
                            : "border-border/60 text-muted-foreground")
                      }
                    >
                      {t.label}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <Button asChild className="rounded-xl">
                    <Link to="/score">
                      View full breakdown{" "}
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link to="/proofs">Proofs</Link>
                  </Button>
                </div>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreHistory}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={[600, 800]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.75rem",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2.5}
                      dot={{ fill: "hsl(var(--primary))", r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Earnings",
              value: `$${TOTAL_EARNINGS.toFixed(2)}`,
              icon: DollarSign,
              sub: "from data queries",
            },
            {
              label: "Active Consumers",
              value: dataConsumers.filter((c) => c.status === "active").length,
              icon: Activity,
              sub: "dApps querying you",
            },
            {
              label: "Proofs Issued",
              value: 12,
              icon: Lock,
              sub: "in last 30 days",
            },
            {
              label: "Score Trend",
              value: `+${SCORE_DELTA_30D}`,
              icon: TrendingUp,
              sub: "over 30 days",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="rounded-2xl border-border/60 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Overview;
