import { useMemo, useState } from "react";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Bell,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type NotificationType = "alert" | "request" | "info";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  cta?: { label: string; to: string };
  unread: boolean;
}

const TYPE_META: Record<
  NotificationType,
  { label: string; icon: typeof Bell; className: string }
> = {
  alert: {
    label: "Alert",
    icon: AlertCircle,
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  request: {
    label: "Request",
    icon: ShieldCheck,
    className: "border-info/30 bg-info/10 text-info",
  },
  info: {
    label: "Info",
    icon: Bell,
    className: "border-border/60 bg-muted/20 text-muted-foreground",
  },
};

const Notifications = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>([
    {
      id: "n1",
      type: "request",
      title: "Proof requested: X Followers ≥ 5k",
      description:
        "A dApp requested a proof to unlock creator-tier access. You can approve by generating the proof.",
      time: "5 minutes ago",
      cta: { label: "Complete proof", to: "/proofs/new?template=z9" },
      unread: true,
    },
    {
      id: "n2",
      type: "alert",
      title: "New data access",
      description: "Compound queried: score, liquidationHistory (paid $0.38).",
      time: "8 hours ago",
      cta: { label: "View access", to: "/access" },
      unread: true,
    },
    {
      id: "n3",
      type: "info",
      title: "Proof expiring soon",
      description: "Your “Wallet Age” proof expires in 3 days.",
      time: "Yesterday",
      cta: { label: "Renew", to: "/proofs/ip012" },
      unread: false,
    },
  ]);

  const unreadCount = useMemo(
    () => items.filter((i) => i.unread).length,
    [items],
  );

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
    toast.success("All caught up");
  };

  return (
    <>
      <AppHeader
        title="Notifications"
        subtitle="Alerts, proof requests, and account activity"
      />

      <div className="flex-1 px-4 md:px-8 pb-8 space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Card className="rounded-2xl border-border/60 p-4 w-full md:w-auto">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              Unread
            </p>
            <p className="font-display text-2xl font-bold mt-1">
              {unreadCount}
            </p>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              Mark all read
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {items.map((n) => {
            const meta = TYPE_META[n.type];
            const Icon = meta.icon;
            return (
              <button
                key={n.id}
                onClick={() => {
                  setItems((prev) =>
                    prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
                  );
                  if (n.cta) navigate(n.cta.to);
                }}
                className={
                  "w-full text-left rounded-2xl border p-4 transition-colors " +
                  (n.unread
                    ? "border-border bg-card hover:bg-muted/30"
                    : "border-border/50 bg-card/70 hover:bg-muted/20")
                }
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-display font-semibold text-foreground">
                        {n.title}
                      </p>
                      <Badge
                        variant="outline"
                        className={"rounded-full text-[10px] " + meta.className}
                      >
                        {meta.label}
                      </Badge>
                      {n.unread && (
                        <Badge
                          variant="outline"
                          className="rounded-full text-[10px] border-primary/30 bg-primary/10 text-primary"
                        >
                          Unread
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {n.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {n.time}
                      </span>
                      {n.cta && (
                        <>
                          <span>·</span>
                          <span className="text-foreground inline-flex items-center gap-1">
                            {n.cta.label} <ArrowUpRight className="h-3 w-3" />
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Notifications;

