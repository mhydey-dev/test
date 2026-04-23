import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Lock, ShieldCheck, Search, Plus, ArrowUpRight, Clock, X, AlertCircle, Hourglass,
} from "lucide-react";
import { issuedProofs, zkTemplates, type IssuedProof, type ProofStatus } from "@/lib/reputation-mock";

const PAGE_SIZE = 8;

const STATUS_META: Record<ProofStatus, { label: string; className: string; icon: typeof ShieldCheck }> = {
  active:  { label: "Active",  className: "border-success/30 bg-success/10 text-success",         icon: ShieldCheck },
  expired: { label: "Expired", className: "border-warning/30 bg-warning/10 text-warning",         icon: AlertCircle },
  revoked: { label: "Revoked", className: "border-destructive/30 bg-destructive/10 text-destructive", icon: X },
  pending: { label: "Pending", className: "border-info/30 bg-info/10 text-info",                  icon: Hourglass },
};

const Proofs = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered: IssuedProof[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return issuedProofs.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      return (
        p.template.toLowerCase().includes(q) ||
        p.predicate.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.consumer ?? "").toLowerCase().includes(q)
      );
    }).sort((a, b) => b.issuedAtMs - a.issuedAtMs);
  }, [query, status, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const counts = useMemo(() => ({
    all:     issuedProofs.length,
    active:  issuedProofs.filter((p) => p.status === "active").length,
    expired: issuedProofs.filter((p) => p.status === "expired").length,
    revoked: issuedProofs.filter((p) => p.status === "revoked").length,
    pending: issuedProofs.filter((p) => p.status === "pending").length,
  }), []);

  const resetFilters = () => {
    setQuery(""); setStatus("all"); setCategory("all"); setPage(1);
  };

  const hasFilters = query !== "" || status !== "all" || category !== "all";

  return (
    <TooltipProvider delayDuration={200}>
      <AppHeader title="ZK Proofs" subtitle="Prove what you need to — reveal nothing else" />

      <div className="flex-1 px-4 md:px-8 pb-8 space-y-6">
        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total proofs",  value: counts.all,     tone: "text-foreground" },
            { label: "Active",        value: counts.active,  tone: "text-success" },
            { label: "Expired",       value: counts.expired, tone: "text-warning" },
            { label: "Revoked",       value: counts.revoked, tone: "text-destructive" },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl border-border/60 p-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
              <p className={"font-display text-2xl font-bold mt-1 " + s.tone}>{s.value}</p>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <Card className="rounded-2xl border-border/60 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col sm:flex-row gap-2">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search by template, predicate, dApp, or proof ID…"
                  className="pl-9 rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                  <SelectTrigger className="rounded-xl w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
                  <SelectTrigger className="rounded-xl w-full sm:w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="Risk">Risk</SelectItem>
                    <SelectItem value="Identity">Identity</SelectItem>
                    <SelectItem value="Activity">Activity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={resetFilters} className="rounded-xl">
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
              <Button asChild className="rounded-xl bg-primary hover:bg-primary/90">
                <Link to={`/proofs/new`}>
                  <Plus className="h-4 w-4 mr-1" /> Generate proof
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing <span className="text-foreground font-medium">{pageItems.length}</span> of{" "}
            <span className="text-foreground font-medium">{filtered.length}</span> proofs
          </div>
        </Card>

        {/* List */}
        <div className="space-y-2">
          {pageItems.length === 0 ? (
            <Card className="rounded-2xl border-border/60 border-dashed p-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-3">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">No proofs match your filters</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try clearing filters or generating a new proof.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {hasFilters && (
                  <Button variant="outline" onClick={resetFilters} className="rounded-xl">Clear filters</Button>
                )}
                <Button asChild className="rounded-xl">
                  <Link to="/proofs/new">Generate proof</Link>
                </Button>
              </div>
            </Card>
          ) : (
            pageItems.map((p, i) => {
              const meta = STATUS_META[p.status];
              const StatusIcon = meta.icon;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.16) }}
                >
                  <button
                    onClick={() => navigate(`/proofs/${p.id}`)}
                    className="w-full text-left rounded-2xl border border-border/60 bg-card p-4 hover:border-border hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Lock className="h-4 w-4 text-primary" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display font-semibold text-foreground truncate">
                            {p.template}
                          </p>
                          <Badge variant="outline" className={"rounded-full text-[10px] " + meta.className}>
                            <StatusIcon className="h-2.5 w-2.5 mr-1" /> {meta.label}
                          </Badge>
                          <Badge variant="outline" className="rounded-full text-[10px] border-border/60 text-muted-foreground">
                            {p.category}
                          </Badge>
                        </div>
                        <code className="block text-xs text-muted-foreground font-mono mt-1 truncate">
                          {p.predicate}
                        </code>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground flex-wrap">
                          <span className="font-mono">{p.id}</span>
                          <span>·</span>
                          <span>Issued {p.issuedAt}</span>
                          {p.consumer && (
                            <>
                              <span>·</span>
                              <span>For <span className="text-foreground">{p.consumer}</span></span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="hidden md:flex flex-col items-end gap-1 shrink-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={"flex items-center gap-1 text-xs " +
                              (p.status === "active" ? "text-muted-foreground" :
                               p.status === "expired" ? "text-warning" : "text-muted-foreground")}>
                              <Clock className="h-3 w-3" /> {p.expiresAt}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Lifetime: 30 days</TooltipContent>
                        </Tooltip>
                        <span className="text-[11px] text-muted-foreground">
                          {p.verifications} verifications
                        </span>
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
                    </div>
                  </button>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={(e) => { e.preventDefault(); setPage(Math.max(1, currentPage - 1)); }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  href="#"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const n = idx + 1;
                const show =
                  n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1;
                const showLeftEllipsis = n === currentPage - 2 && n > 1;
                const showRightEllipsis = n === currentPage + 2 && n < totalPages;

                if (showLeftEllipsis || showRightEllipsis) {
                  return (
                    <PaginationItem key={`e-${n}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                if (!show) return null;

                return (
                  <PaginationItem key={n}>
                    <PaginationLink
                      href="#"
                      isActive={n === currentPage}
                      onClick={(e) => { e.preventDefault(); setPage(n); }}
                      className="cursor-pointer"
                    >
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => { e.preventDefault(); setPage(Math.min(totalPages, currentPage + 1)); }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {/* Templates shortcut */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-lg font-bold">Quick templates</h2>
              <p className="text-xs text-muted-foreground">Common predicates ready to prove.</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {zkTemplates.map((t) => (
              <Link
                key={t.id}
                to={`/proofs/new?template=${t.id}`}
                className="rounded-xl border border-border/60 p-4 hover:border-border hover:bg-muted/30 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <Badge variant="outline" className="rounded-full text-[10px] border-border/60">
                    {t.category}
                  </Badge>
                </div>
                <p className="font-display font-semibold text-sm text-foreground">{t.title}</p>
                <code className="block text-xs text-muted-foreground font-mono mt-1 truncate">
                  {t.predicate}
                </code>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default Proofs;
