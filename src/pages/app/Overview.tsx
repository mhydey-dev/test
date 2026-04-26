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

const Overview = () => {
  const recentConsumers = dataConsumers.slice(0, 4);

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
