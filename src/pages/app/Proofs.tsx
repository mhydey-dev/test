import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Search,
  ArrowUpRight,
  X,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import {
  proofProviders,
  zkProofGroups,
  zkProofLevelsByGroupId,
  PROOF_CATEGORIES,
  type ZkProofGroup,
  type ProofProvider,
} from "@/lib/reputation-mock";

const PAGE_SIZE = 8;

const Proofs = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ZkProofGroup["category"]>(
    "all",
  );
  const [page, setPage] = useState(1);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);

  const providerById = useMemo(
    () =>
      new Map<ProofProvider["id"], ProofProvider>(
        proofProviders.map((p) => [p.id, p]),
      ),
    [],
  );

  const enriched = useMemo(
    () =>
      zkProofGroups.map((g) => {
        const levels = zkProofLevelsByGroupId[g.id] ?? [];
        const totalCompleted = levels.reduce((a, l) => a + l.completedCount, 0);
        return { ...g, levels, totalCompleted };
      }),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter((g) => {
      if (category !== "all" && g.category !== category) return false;
      if (!q) return true;
      if (g.title.toLowerCase().includes(q)) return true;
      if (g.subtitle.toLowerCase().includes(q)) return true;
      return g.levels.some(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.predicate.toLowerCase().includes(q),
      );
    });
  }, [enriched, query, category]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const counts = useMemo(
    () => ({
      groups: enriched.length,
      levels: enriched.reduce((a, g) => a + g.levels.length, 0),
      providers: proofProviders.length,
      completed: enriched.reduce((a, g) => a + g.totalCompleted, 0),
    }),
    [enriched],
  );

  const hasFilters = query !== "" || category !== "all";
  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setPage(1);
  };

  return (
    <>
      <AppHeader
        title="ZK Proofs"
        subtitle="Prove what you need to — reveal nothing else"
      />

      <div className="flex-1 px-4 md:px-8 pb-8 space-y-6">
        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Proof groups", value: counts.groups },
            { label: "Levels available", value: counts.levels },
            { label: "Providers", value: counts.providers },
            { label: "Completed", value: counts.completed.toLocaleString() },
          ].map((s) => (
            <Card key={s.label} className="rounded-2xl border-border/60 p-4">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
                {s.label}
              </p>
              <p className="font-display text-2xl font-bold mt-1 text-foreground">
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
                  placeholder="Search proof groups or levels…"
                  className="pl-9 rounded-xl"
                />
              </div>
              <Select
                value={category}
                onValueChange={(v) => {
                  setCategory(v as typeof category);
                  setPage(1);
                }}
              >
                <SelectTrigger className="rounded-xl w-full sm:w-[200px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {PROOF_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="rounded-xl shrink-0"
              >
                <X className="h-4 w-4 mr-1" /> Clear filters
              </Button>
            )}
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
            proof groups
          </div>
        </Card>

        {/* List */}
        <div className="space-y-4">
          {pageItems.length === 0 ? (
            <Card className="rounded-2xl border-border/60 border-dashed p-12 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted mx-auto flex items-center justify-center mb-3">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground">
                No proof groups match your filters
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Try clearing filters or browsing another category.
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="rounded-xl mt-4"
                >
                  Clear filters
                </Button>
              )}
            </Card>
          ) : (
            pageItems.map((g, i) => {
              const isOpen = openGroupId === g.id;
              const provider = providerById.get(g.providerId);
              const previewLevels = g.levels.slice(0, 3);

              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.16) }}
                  className="space-y-0"
                >
                  {/* Parent group card */}
                  <Card
                    onClick={() =>
                      setOpenGroupId((prev) => (prev === g.id ? null : g.id))
                    }
                    className="rounded-2xl border-border/60 p-5 cursor-pointer hover:border-border hover:bg-muted/20 transition-colors relative z-20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl overflow-hidden border border-border/40 bg-muted/40 shrink-0">
                        <img
                          src={g.imageUrl}
                          alt={`${g.title} logo`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          width={48}
                          height={48}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display font-bold text-base text-foreground truncate">
                            {g.title}
                          </p>
                          <Badge
                            variant="outline"
                            className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                          >
                            {g.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                          >
                            {g.levels.length} levels
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
                        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
                          {g.subtitle}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1.5">
                          <span className="text-foreground font-medium">
                            {g.totalCompleted.toLocaleString()}
                          </span>{" "}
                          users completed levels in this group
                        </p>
                      </div>

                      <div className="shrink-0 mt-1 text-muted-foreground">
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* COLLAPSED stack — full-width child cards stacked UNDER the parent,
                      showing only a thin progress strip per level */}
                  {!isOpen && previewLevels.length > 0 && (
                    <div className="relative">
                      {previewLevels.map((l, idx) => {
                        const layer = idx;
                        const pct = Math.round(
                          ((l.rank) / g.levels.length) * 100,
                        );
                        return (
                          <div
                            key={l.id}
                            className="rounded-2xl border border-border/60 bg-card/80 px-5 py-2.5 shadow-sm"
                            style={{
                              marginTop: layer === 0 ? -10 : -14,
                              marginLeft: 12 + layer * 6,
                              marginRight: 12 + layer * 6,
                              opacity: 1 - layer * 0.18,
                              zIndex: 10 - layer,
                              position: "relative",
                            }}
                          >
                            <div className="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
                              <span className="truncate">{l.name}</span>
                              <span className="shrink-0">
                                Level {l.rank} ·{" "}
                                {l.completedCount.toLocaleString()}
                              </span>
                            </div>
                            <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* EXPANDED — full-width individual level cards */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="space-y-2 pt-2"
                      >
                        {g.levels.slice(0, 3).map((l) => (
                          <Card
                            key={l.id}
                            className="rounded-2xl border-border/60 p-4"
                          >
                            <div className="flex items-start gap-3">
                              <div className="h-9 w-9 rounded-xl overflow-hidden border border-border/40 bg-muted/40 shrink-0">
                                <img
                                  src={g.imageUrl}
                                  alt={`${g.title} logo`}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  width={36}
                                  height={36}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {l.name}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="rounded-full text-[10px] border-border/60 text-muted-foreground"
                                  >
                                    Level {l.rank}
                                  </Badge>
                                </div>
                                <code className="block text-[11px] text-muted-foreground font-mono mt-1 truncate">
                                  {l.predicate}
                                </code>
                                <p className="text-[11px] text-muted-foreground mt-1">
                                  <span className="text-foreground font-medium">
                                    {l.completedCount.toLocaleString()}
                                  </span>{" "}
                                  completed
                                </p>
                              </div>
                            </div>
                          </Card>
                        ))}

                        {g.levels.length > 3 && (
                          <Button
                            variant="outline"
                            className="rounded-xl w-full"
                            onClick={() => navigate(`/proof-groups/${g.id}`)}
                          >
                            View all {g.levels.length} levels
                            <ArrowUpRight className="h-4 w-4 ml-1.5" />
                          </Button>
                        )}
                        {g.levels.length <= 3 && (
                          <Button
                            variant="outline"
                            className="rounded-xl w-full"
                            onClick={() => navigate(`/proof-groups/${g.id}`)}
                          >
                            Open group
                            <ArrowUpRight className="h-4 w-4 ml-1.5" />
                          </Button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
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
    </>
  );
};

export default Proofs;
