import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MAIN_SCORE, SCORE_TIER, SCORE_DELTA_30D, PERCENTILE,
  scoreHistory, scoreBreakdown, behavioralTags,
} from "@/lib/reputation-mock";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend, ReferenceDot,
} from "recharts";

const Score = () => {
  const annotated = scoreHistory.filter((p) => p.event);

  return (
    <>
      <AppHeader title="Trust Score" subtitle="Full breakdown of your on-chain reputation" />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="rounded-2xl border-border/60 p-6 h-full">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Score</p>
              <p className="font-display text-5xl font-bold mt-2">{MAIN_SCORE}</p>
              <Badge className="mt-3 rounded-full bg-primary/10 text-primary border-primary/30" variant="outline">
                {SCORE_TIER}
              </Badge>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="rounded-2xl border-border/60 p-6 h-full">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Percentile</p>
              <p className="font-display text-5xl font-bold mt-2">{PERCENTILE}%</p>
              <p className="text-xs text-muted-foreground mt-3">Top of all tracked wallets</p>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-2xl border-border/60 p-6 h-full">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">30-day change</p>
              <p className="font-display text-5xl font-bold mt-2 text-success">+{SCORE_DELTA_30D}</p>
              <p className="text-xs text-muted-foreground mt-3">Trending up</p>
            </Card>
          </motion.div>
        </div>

        {/* History chart with annotations */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold">Score history</h2>
              <p className="text-xs text-muted-foreground">Annotated with major on-chain events</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[580, 820]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value, _name, item: any) => [
                    `${value}${item?.payload?.event ? ` · ${item.payload.event}` : ""}`,
                    "Score",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  activeDot={{ r: 6 }}
                />
                {annotated.map((p) => (
                  <ReferenceDot key={p.date} x={p.date} y={p.score} r={6} fill="hsl(var(--warning))" stroke="hsl(var(--card))" />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {annotated.map((p) => (
              <Badge key={p.date} variant="outline" className="rounded-full text-xs border-border/60">
                <span className="text-muted-foreground mr-1">{p.date}:</span>
                <span className="text-foreground">{p.event}</span>
              </Badge>
            ))}
          </div>
        </Card>

        {/* Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="rounded-2xl border-border/60 p-6">
            <h2 className="font-display text-xl font-bold mb-4">Score composition</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreBreakdown}
                    dataKey="weight"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {scoreBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                    }}
                    formatter={(v: number) => [`${v}%`, "Weight"]}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="rounded-2xl border-border/60 p-6">
            <h2 className="font-display text-xl font-bold mb-4">Points contribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreBreakdown} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "0.75rem",
                    }}
                    formatter={(v: number) => [`${v} pts`, "Contribution"]}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {scoreBreakdown.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Tags */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-1">Behavioral tags</h2>
          <p className="text-sm text-muted-foreground mb-4">
            AI-detected patterns from your on-chain footprint.
          </p>
          <div className="flex flex-wrap gap-2">
            {behavioralTags.map((t) => (
              <Badge
                key={t.label}
                variant="outline"
                className={
                  "rounded-full px-3 py-1 text-sm font-medium " +
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
        </Card>
      </div>
    </>
  );
};

export default Score;
