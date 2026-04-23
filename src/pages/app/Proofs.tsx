import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ShieldCheck,
  Search,
  ArrowUpRight,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  proofProviders,
  zkProofGroups,
  zkProofTemplatesByGroupId,
  type ProofProvider,
} from "@/lib/reputation-mock";

const PAGE_SIZE = 8;

const Proofs = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const providerById = useMemo(
    () =>
      new Map<ProofProvider["id"], ProofProvider>(
        proofProviders.map((p) => [p.id, p]),
      ),
    [],
  );

  const categories = useMemo(() => {
    return zkProofGroups.map((g) => {
      const children = zkProofTemplatesByGroupId[g.id] ?? [];
      const totalCompleted = children.reduce((a, t) => a + t.completedCount, 0);
      return { ...g, children, totalCompleted };
    });
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.filter((g) => {
      if (!q) return true;
      if (g.title.toLowerCase().includes(q)) return true;
      return g.children.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.predicate.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q),
      );
    });
  }, [categories, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const counts = useMemo(
    () => ({
      categories: categories.length,
      proofs: categories.reduce((a, g) => a + g.children.length, 0),
      providers: proofProviders.length,
      completed: categories.reduce((a, g) => a + g.totalCompleted, 0),
    }),
    [categories],
  );

  const resetFilters = () => {
    setQuery("");
    setPage(1);
  };

  const hasFilters = query !== "";

  return (
    <TooltipProvider delayDuration={200}>
      <AppHeader
        title="ZK Proofs"
        subtitle="Prove what you need to — reveal nothing else"
      />

      <div className="flex-1 px-4 md:px-8 pb-8 space-y-6">
        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: "Categories",
              value: counts.categories,
              tone: "text-foreground",
            },
            {
              label: "Proofs",
              value: counts.proofs,
              tone: "text-foreground",
            },
            {
              label: "Providers",
              value: counts.providers,
              tone: "text-foreground",
            },
            {
              label: "Completed",
              value: counts.completed.toLocaleString(),
              tone: "text-foreground",
            },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl border-border/60 p-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {s.label}
              </p>
              <p className={"font-display text-2xl font-bold mt-1 " + s.tone}>
                {s.value}
              </p>
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
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search categories or proofs…"
                  className="pl-9 rounded-xl"
                />
              </div>
              <Select
                value="all"
                onValueChange={() => {
                  /* reserved for future filters */
                }}
              >
                <SelectTrigger className="rounded-xl w-full sm:w-[220px]">
                  <SelectValue placeholder="All proof groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All proof groups</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => navigate("/proofs/new")}
              >
                Generate custom proof
                <ArrowUpRight className="h-4 w-4 ml-1.5" />
              </Button>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="rounded-xl"
                >
                  <X className="h-4 w-4 mr-1" /> Clear
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing{" "}
            <span className="text-foreground font-medium">
              {pageItems.length}
            </span>{" "}
            of{" "}
            <span className="text-foreground font-medium">
              {filtered.length}
            </span>{" "}
            categories
          </div>
        </Card>

        {/* List */}
        <div className="space-y-2">
          {pageItems.length === 0 ? (
            <Card className="rounded-2xl border-border/60 border-dashed p-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-3">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">
                No proofs match your filters
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try clearing filters or generating a new proof.
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {hasFilters && (
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="rounded-xl"
                  >
                    Clear filters
                  </Button>
                )}
                <Button asChild className="rounded-xl">
                  <Link to="/proofs/new">Generate proof</Link>
                </Button>
              </div>
            </Card>
          ) : (
            pageItems.map((g, i) => {
              const isOpen = openGroupId === g.id;
              const provider = providerById.get(g.providerId);
              const preview = g.children.slice(0, 3);

              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.16) }}
                >
                  <div className="w-full">
                    {/* Parent group card */}
                    <button
                      onClick={() =>
                        setOpenGroupId((prev) => (prev === g.id ? null : g.id))
                      }
                      className="w-full text-left rounded-2xl border border-border/60 bg-card p-4 hover:border-border hover:bg-muted/30 transition-colors group relative z-10"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 overflow-hidden border border-border/40">
                          <img
                            src={g.imageUrl}
                            alt={`${g.title} logo`}
                            className="h-10 w-10 object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-display font-semibold text-foreground truncate">
                              {g.title}
                            </p>
                            <Badge
                              variant="outline"
                              className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                            >
                              {g.children.length} levels
                            </Badge>
                            {provider && (
                              <Badge
                                variant="outline"
                                className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                              >
                                {provider.name}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Parent proof group · children represent your level
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground flex-wrap">
                            <span>
                              <span className="text-foreground font-medium">
                                {g.totalCompleted.toLocaleString()}
                              </span>{" "}
                              completed
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 mt-1 text-muted-foreground group-hover:text-foreground transition-colors">
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Stacked children (outside parent card) */}
                    {!isOpen && preview.length > 0 && (
                      <div className="relative -mt-3 pt-3">
                        {preview.map((t, idx) => {
                          const layer = idx; // 0..2
                          const max = Math.max(1, preview.length - 1);
                          const pct = Math.round(((layer + 1) / (max + 1)) * 100);
                          return (
                            <div
                              key={t.id}
                              className="rounded-2xl border border-border/60 bg-card/70 overflow-hidden"
                              style={{
                                marginTop: layer === 0 ? 0 : -16,
                                transform: `translateY(${layer * 6}px)`,
                                opacity: 1 - layer * 0.12,
                              }}
                            >
                              {/* show only bottom strip */}
                              <div className="h-16 flex items-end">
                                <div className="w-full px-4 pb-3">
                                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                                    <span className="truncate">{t.title}</span>
                                    <span>
                                      Level {t.levelRank} ·{" "}
                                      {t.completedCount.toLocaleString()} completed
                                    </span>
                                  </div>
                                  <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                      className="h-full bg-primary"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Expanded: individual child cards + view all */}
                    {isOpen && (
                      <div className="mt-2 space-y-2">
                        {g.children.slice(0, 6).map((t) => {
                          const p = providerById.get(t.providerId);
                          return (
                            <button
                              key={t.id}
                              onClick={() => navigate(`/proofs/new?template=${t.id}`)}
                              className="w-full text-left rounded-2xl border border-border/60 bg-card/70 hover:bg-muted/20 hover:border-border transition-colors p-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 overflow-hidden border border-border/40">
                                  <img
                                    src={g.imageUrl}
                                    alt={`${g.title} logo`}
                                    className="h-10 w-10 object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {t.title}
                                    </p>
                                    <Badge
                                      variant="outline"
                                      className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                                    >
                                      Level {t.levelRank}
                                    </Badge>
                                    {p && (
                                      <Badge
                                        variant="outline"
                                        className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                                      >
                                        {p.name}
                                      </Badge>
                                    )}
                                  </div>
                                  <code className="block text-[11px] text-muted-foreground font-mono mt-1 truncate">
                                    {t.predicate}
                                  </code>
                                  <p className="text-[11px] text-muted-foreground mt-1">
                                    <span className="text-foreground font-medium">
                                      {t.completedCount.toLocaleString()}
                                    </span>{" "}
                                    completed
                                  </p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                              </div>
                            </button>
                          );
                        })}

                        <div className="flex justify-between gap-2 flex-wrap">
                          {g.children.length > 6 ? (
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => navigate(`/proof-groups/${g.id}`)}
                            >
                              View all levels
                              <ArrowUpRight className="h-4 w-4 ml-1.5" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              className="rounded-xl"
                              onClick={() => navigate(`/proof-groups/${g.id}`)}
                            >
                              Open group
                              <ArrowUpRight className="h-4 w-4 ml-1.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Math.max(1, currentPage - 1));
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  href="#"
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const n = idx + 1;
                const show =
                  n === 1 || n === totalPages || Math.abs(n - currentPage) <= 1;
                const showLeftEllipsis = n === currentPage - 2 && n > 1;
                const showRightEllipsis =
                  n === currentPage + 2 && n < totalPages;

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
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(n);
                      }}
                      className="cursor-pointer"
                    >
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(Math.min(totalPages, currentPage + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </TooltipProvider>
  );
};

export default Proofs;
