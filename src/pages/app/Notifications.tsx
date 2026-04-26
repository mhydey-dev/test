import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Bell,
  ShieldCheck,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Trash2,
  BellOff,
} from "lucide-react";

type NotificationType = "alert" | "request" | "info";

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  cta?: { label: string; to: string; };
  unread: boolean;
}

const TYPE_META: Record<
  NotificationType,
  { label: string; icon: typeof Bell; className: string; }
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

const SEED: NotificationItem[] = [
  {
    id: "n1",
    type: "request",
    title: "Proof requested: X Followers Above 10,000",
    description:
      "A dApp asked you to prove your X follower count to unlock creator-tier access.",
    time: "5 minutes ago",
    cta: { label: "Open group", to: "/proof-groups/x-followers" },
    unread: true,
  },
  {
    id: "n2",
    type: "alert",
    title: "New data access by Compound",
    description: "Compound queried score, liquidationHistory (paid $0.38).",
    time: "8 hours ago",
    cta: { label: "View access", to: "/access" },
    unread: true,
  },
  {
    id: "n3",
    type: "info",
    title: "Proof expiring soon",
    description: "Your “Wallet Older Than 1 Year” proof expires in 3 days.",
    time: "Yesterday",
    cta: { label: "Renew", to: "/proof-groups/wallet-age" },
    unread: false,
  },
  {
    id: "n4",
    type: "alert",
    title: "Score updated",
    description: "Your credit score increased by +6 to 782 this week.",
    time: "2 days ago",
    cta: { label: "View score", to: "/score" },
    unread: false,
  },
  {
    id: "n5",
    type: "request",
    title: "Proof requested: Verified Unique Human",
    description:
      "Snapshot asked you to prove sybil-resistance to weight your DAO vote.",
    time: "3 days ago",
    cta: { label: "Open group", to: "/proof-groups/identity" },
    unread: false,
  },
  {
    id: "n6",
    type: "info",
    title: "Earnings paid out",
    description: "$4.20 from data queries was settled to your wallet.",
    time: "1 week ago",
    cta: { label: "View earnings", to: "/access" },
    unread: false,
  },
];

type Filter = "all" | "unread" | NotificationType;

const Notifications = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<NotificationItem[]>(SEED);
  const [filter, setFilter] = useState<Filter>("all");

  const unreadCount = useMemo(
    () => items.filter((i) => i.unread).length,
    [items],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    if (filter === "unread") return items.filter((i) => i.unread);
    return items.filter((i) => i.type === filter);
  }, [items, filter]);

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
    toast.success("All caught up");
  };

  const clearAll = () => {
    setItems([]);
    toast("Notifications cleared");
  };

  const onItemClick = (n: NotificationItem) => {
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
    );
    if (n.cta) navigate(n.cta.to);
  };

  return (
    <>
      <div className="flex-1 px-4 md:px-8 pb-8 space-y-6">
        {/* Toolbar */}
        <div className="p-1">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as Filter)}
              className="w-full sm:w-auto"
            >
              <TabsList className="rounded-xl">
                <TabsTrigger value="all" className="rounded-lg">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="rounded-lg">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
                <TabsTrigger value="request" className="rounded-lg">
                  Requests
                </TabsTrigger>
                <TabsTrigger value="alert" className="rounded-lg">
                  Alerts
                </TabsTrigger>
                <TabsTrigger value="info" className="rounded-lg">
                  Info
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={markAllRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                Mark all read
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-muted-foreground"
                onClick={clearAll}
                disabled={items.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <Card className="rounded-2xl border-border/60 border-dashed p-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-3">
                <BellOff className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">
                You're all caught up
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === "all"
                  ? "No notifications yet."
                  : "No notifications in this view."}
              </p>
            </Card>
          ) : (
            filtered.map((n, i) => {
              const meta = TYPE_META[n.type];
              const Icon = meta.icon;
              return (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.16) }}
                  onClick={() => onItemClick(n)}
                  className={
                    "w-full text-left rounded-2xl border p-4 transition-colors " +
                    (n.unread
                      ? "border-border bg-card hover:bg-muted/30"
                      : "border-border/50 bg-card/70 hover:bg-muted/20")
                  }
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border " +
                        meta.className
                      }
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display font-semibold text-foreground">
                          {n.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={
                            "rounded-full text-[10px] " + meta.className
                          }
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
                              {n.cta.label}{" "}
                              <ArrowUpRight className="h-3 w-3" />
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
