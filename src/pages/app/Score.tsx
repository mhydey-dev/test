import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  MAIN_SCORE,
  SCORE_TIER,
  SCORE_DELTA_30D,
  PERCENTILE,
  CREDIT_SCORE_OBJECT_ID,
  scoreHistory,
  scoreBreakdown,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
  ReferenceDot,
} from "recharts";
import { Copy } from "lucide-react";

const Score = () => {
  const annotated = scoreHistory.filter((p) => p.event);

  const copy = (text: string, label = "Copied to clipboard") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  return (
    <>
      <div className="flex-1 px-4 md:px-8 py-6  space-y-6">
        <div className="grid md:grid-cols-3 rounded-xl border border-border/40 p-6 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Score
            </p>
            <p className="font-display text-5xl font-bold mt-2">
              {MAIN_SCORE}
            </p>
            <Badge
              className="mt-3 rounded-full bg-primary/10 text-primary border-primary/30"
              variant="outline"
            >
              {SCORE_TIER}
            </Badge>

            <div className="mt-5 pt-4 border-t border-border/40">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                Tokenized score object id
              </p>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 p-2.5 rounded-xl bg-muted border border-border/60 font-mono text-[11px] text-foreground break-all">
                  {CREDIT_SCORE_OBJECT_ID}
                </code>
                <Button
                  onClick={() => copy(CREDIT_SCORE_OBJECT_ID, "Object id copied")}
                  size="icon"
                  variant="outline"
                  className="rounded-xl shrink-0"
                  aria-label="Copy object id"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Percentile
            </p>
            <p className="font-display text-5xl font-bold mt-2">
              {PERCENTILE}%
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Top of all tracked wallets
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              30-day change
            </p>
            <p className="font-display text-5xl font-bold mt-2 text-success">
              +{SCORE_DELTA_30D}
            </p>
            <p className="text-xs text-muted-foreground mt-3">Trending up</p>
          </motion.div>
        </div>

        {/* History chart with annotations */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold">Score history</h2>
              <p className="text-xs text-muted-foreground">
                Annotated with major on-chain events
              </p>
            </div>
          </div>
          <div className="h-72">
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
                  domain={[580, 820]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(
                    value,
                    _name,
                    item?: { payload?: { event?: string; }; },
                  ) => [
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
                  <ReferenceDot
                    key={p.date}
                    x={p.date}
                    y={p.score}
                    r={6}
                    fill="hsl(var(--warning))"
                    stroke="hsl(var(--card))"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {annotated.map((p) => (
              <Badge
                key={p.date}
                variant="outline"
                className="rounded-full text-xs border-border/60"
              >
                <span className="text-muted-foreground mr-1">{p.date}:</span>
                <span className="text-foreground">{p.event}</span>
              </Badge>
            ))}
          </div>
        </Card>

        {/* Breakdown */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="rounded-2xl border-border/60 p-6">
            <h2 className="font-display text-xl font-bold mb-4">
              Score composition
            </h2>
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
            <h2 className="font-display text-xl font-bold mb-4">
              Points contribution
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={scoreBreakdown}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                    opacity={0.3}
                  />
                  <XAxis
                    type="number"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={120}
                  />
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
        <div>
          <h2 className="font-display text-xl font-bold mb-1">
            Behavioral tags
          </h2>
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
        </div>
      </div>
    </>
  );
};

export default Score;
