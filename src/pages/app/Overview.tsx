import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Shield, TrendingUp, DollarSign, Activity, ArrowUpRight, Lock, Sparkles,
} from "lucide-react";
import {
  MAIN_SCORE, SCORE_TIER, SCORE_DELTA_30D, PERCENTILE,
  scoreHistory, dataConsumers, TOTAL_EARNINGS, behavioralTags,
} from "@/lib/reputation-mock";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const Overview = () => {
  const recentConsumers = dataConsumers.slice(0, 4);

  return (
    <>
      <AppHeader title="Overview" subtitle="Your AI on-chain identity at a glance" />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8">
        {/* Hero score card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="rounded-3xl border-border/60 p-6 md:p-10 bg-card overflow-hidden relative">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge variant="outline" className="rounded-full border-primary/30 text-primary bg-primary/5 mb-4">
                  <Shield className="h-3 w-3 mr-1" /> Tier · {SCORE_TIER}
                </Badge>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-7xl md:text-8xl font-bold text-foreground tracking-tight">
                    {MAIN_SCORE}
                  </span>
                  <span className="text-muted-foreground text-2xl">/ 1000</span>
                </div>
                <p className="text-muted-foreground mt-3">
                  You're in the top <span className="text-foreground font-medium">{PERCENTILE}%</span> of wallets ·
                  <span className="text-success font-medium ml-1">+{SCORE_DELTA_30D} this month</span>
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
                    <Link to="/score">View full breakdown <ArrowUpRight className="h-4 w-4 ml-1" /></Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-xl">
                    <Link to="/proofs">Generate ZK proof</Link>
                  </Button>
                </div>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[600, 800]} />
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
          </Card>
        </motion.div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Earnings", value: `$${TOTAL_EARNINGS.toFixed(2)}`, icon: DollarSign, sub: "from data queries" },
            { label: "Active Consumers", value: dataConsumers.filter(c => c.status === "active").length, icon: Activity, sub: "dApps querying you" },
            { label: "ZK Proofs Issued", value: 12, icon: Lock, sub: "in last 30 days" },
            { label: "Score Trend", value: `+${SCORE_DELTA_30D}`, icon: TrendingUp, sub: "over 30 days" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="rounded-2xl border-border/60 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</span>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent activity + quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="md:col-span-2 rounded-2xl border-border/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-lg font-bold">Recent data access</h2>
                <p className="text-xs text-muted-foreground">dApps that queried your reputation</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="rounded-xl">
                <Link to="/access">View all</Link>
              </Button>
            </div>
            <div className="space-y-3">
              {recentConsumers.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-border transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.app}</p>
                      <p className="text-xs text-muted-foreground">{c.fields.join(", ")} · {c.accessedAt}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-success">+${c.paid.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-border/60 p-5">
            <h2 className="font-display text-lg font-bold mb-4">Quick actions</h2>
            <div className="space-y-2">
              {[
                { to: "/proofs",     icon: Lock,      label: "Generate ZK proof", desc: "Selective disclosure" },
                { to: "/ask",        icon: Sparkles,  label: "Ask your data",     desc: "AI-powered insights" },
                { to: "/access",     icon: Activity,  label: "Manage permissions",desc: "Control field access" },
                { to: "/developers", icon: Shield,    label: "API & SDK",         desc: "For dApp builders" },
              ].map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/40 hover:border-border hover:bg-muted/40 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <a.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Overview;
