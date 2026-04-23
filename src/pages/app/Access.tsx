import { useState } from "react";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Activity, DollarSign, TrendingUp, Ban } from "lucide-react";
import {
  dataConsumers, earningsByMonth, permissions as initialPerms, TOTAL_EARNINGS,
} from "@/lib/reputation-mock";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
} from "recharts";

const Access = () => {
  const [perms, setPerms] = useState(initialPerms);
  const [consumers, setConsumers] = useState(dataConsumers);

  const toggle = (id: string) => {
    setPerms(perms.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  };

  const revoke = (id: string) => {
    setConsumers(consumers.map((c) => (c.id === id ? { ...c, status: "revoked" as const } : c)));
    toast.success("Access revoked", { description: "This dApp can no longer query your data." });
  };

  const last30 = consumers.filter((c) => c.status === "active").length;
  const monthly = earningsByMonth[earningsByMonth.length - 1].earnings;

  return (
    <>
      <AppHeader title="Data Access" subtitle="Control what dApps see — and earn from every query" />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 space-y-6">
        {/* Earnings stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="rounded-2xl border-border/60 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Total earnings</span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-display text-3xl font-bold">${TOTAL_EARNINGS.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">All-time from data queries</p>
          </Card>
          <Card className="rounded-2xl border-border/60 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">This month</span>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="font-display text-3xl font-bold text-success">${monthly.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">+22% vs last month</p>
          </Card>
          <Card className="rounded-2xl border-border/60 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Active consumers</span>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="font-display text-3xl font-bold">{last30}</p>
            <p className="text-xs text-muted-foreground mt-1">dApps with permission</p>
          </Card>
        </div>

        {/* Earnings chart */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-4">Earnings over time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(v: number) => [`$${v.toFixed(2)}`, "Earnings"]}
                />
                <Bar dataKey="earnings" radius={[6, 6, 0, 0]}>
                  {earningsByMonth.map((_, i) => (
                    <Cell key={i} fill="hsl(var(--primary))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Permissions */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-1">Field permissions</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Toggle which data fields dApps can query, and set a per-query price.
          </p>
          <div className="space-y-2">
            {perms.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-border/40">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground">{p.field}</p>
                    <Badge variant="outline" className="rounded-full text-[10px] border-border/60">
                      ${p.pricePerQuery.toFixed(2)} / query
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                </div>
                <Switch checked={p.enabled} onCheckedChange={() => toggle(p.id)} />
              </div>
            ))}
          </div>
        </Card>

        {/* Consumers timeline */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-1">Consumers timeline</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Every dApp that has accessed your data, with payment received.
          </p>
          <div className="space-y-3">
            {consumers.map((c) => (
              <div
                key={c.id}
                className={
                  "flex items-center justify-between p-4 rounded-xl border " +
                  (c.status === "revoked"
                    ? "border-border/30 bg-muted/20 opacity-60"
                    : "border-border/40 hover:border-border")
                }
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{c.app}</p>
                      <Badge variant="outline" className="rounded-full text-[10px] border-border/60">
                        {c.category}
                      </Badge>
                      {c.status === "revoked" && (
                        <Badge className="rounded-full text-[10px] bg-destructive/10 text-destructive border-destructive/30" variant="outline">
                          Revoked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {c.fields.join(", ")} · {c.accessedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={"text-sm font-medium " + (c.status === "active" ? "text-success" : "text-muted-foreground")}>
                    +${c.paid.toFixed(2)}
                  </span>
                  {c.status === "active" && (
                    <Button
                      onClick={() => revoke(c.id)}
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      aria-label="Revoke access"
                    >
                      <Ban className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Access;
