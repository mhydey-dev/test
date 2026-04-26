import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export type NotificationType = "alert" | "request" | "info";

export interface NotificationItem {
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
    title: "New data access",
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
];

const NotificationsBell = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(SEED);

  const unread = useMemo(() => items.filter((i) => i.unread).length, [items]);

  const markAllRead = () => {
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })));
    toast.success("All caught up");
  };

  const handleClick = (n: NotificationItem) => {
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, unread: false } : x)),
    );
    if (n.cta) {
      navigate(n.cta.to);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-xl border-border/60 hover:border-border hover:bg-muted/50 h-9 w-9"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center px-1">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[360px] rounded-2xl p-0 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
          <div>
            <p className="font-display font-semibold text-foreground text-sm">
              Notifications
            </p>
            <p className="text-[11px] text-muted-foreground">
              {unread > 0 ? `${unread} unread` : "All caught up"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg h-7 text-xs"
            onClick={markAllRead}
            disabled={unread === 0}
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
        </div>

        <ScrollArea className="max-h-[420px]">
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              You're all caught up.
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {items.map((n) => {
                const meta = TYPE_META[n.type];
                const Icon = meta.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={
                      "w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors " +
                      (n.unread ? "bg-muted/20" : "")
                    }
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={
                          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border " +
                          meta.className
                        }
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground line-clamp-1">
                            {n.title}
                          </p>
                          {n.unread && (
                            <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
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
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="px-3 py-2 border-t border-border/40">
          <Button
            variant="ghost"
            className="w-full rounded-lg text-xs h-8"
            onClick={() => {
              navigate("/notifications");
              setOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsBell;
