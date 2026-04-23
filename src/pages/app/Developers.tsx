import { useState } from "react";
import AppHeader from "@/components/app/AppHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Code2, Copy, Key, Webhook, BookOpen } from "lucide-react";

const SDK_SNIPPET = `import { Databook } from "@databook/sdk";

const sdk = new Databook({ apiKey: process.env.DATABOOK_API_KEY });

// Fetch a wallet's reputation score
const score = await sdk.getReputationScore("0x7a3f...b21e");
// → { score: 782, tier: "Excellent", percentile: 92 }

// Verify a zero-knowledge proof
const ok = await sdk.verifyProof({
  proof: "zkp_8f3a...",
  predicate: "score > 700",
});

// Request data access (user must approve)
await sdk.grantAccess({
  app: "MyDeFiApp",
  data: ["score", "riskProfile"],
});`;

const REST_SNIPPET = `# Fetch reputation score
curl https://api.databook.xyz/v1/score/0x7a3f...b21e \\
  -H "Authorization: Bearer $DATABOOK_API_KEY"

# Response
{
  "wallet": "0x7a3f...b21e",
  "score": 782,
  "tier": "Excellent",
  "percentile": 92,
  "tags": ["consistent_repayer", "long_term_holder"],
  "updated_at": "2025-12-01T10:23:14Z"
}`;

const VERIFY_SNIPPET = `# Verify a ZK proof
curl https://api.databook.xyz/v1/proofs/verify \\
  -H "Authorization: Bearer $DATABOOK_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "proof": "zkp_8f3a4c2b...",
    "predicate": "score > 700"
  }'

# Response
{ "valid": true, "issued_at": "...", "expires_at": "..." }`;

const tiers = [
  { name: "Free",       price: "$0",     queries: "1,000 / mo",   features: ["Score lookup", "Tier classification", "Public proofs verification"] },
  { name: "Builder",    price: "$49",    queries: "50,000 / mo",  features: ["Everything in Free", "Risk profile endpoint", "Webhooks", "Custom predicates"] },
  { name: "Enterprise", price: "Custom", queries: "Unlimited",    features: ["Everything in Builder", "Custom scoring models", "Dedicated infra", "SLA"] },
];

const endpoints = [
  { method: "GET",  path: "/v1/score/:wallet",         description: "Fetch reputation score" },
  { method: "GET",  path: "/v1/risk/:wallet",          description: "Risk classification" },
  { method: "POST", path: "/v1/proofs/verify",         description: "Verify a ZK proof" },
  { method: "POST", path: "/v1/access/request",        description: "Request data access" },
  { method: "GET",  path: "/v1/tags/:wallet",          description: "Behavioral tags" },
  { method: "POST", path: "/v1/webhooks",              description: "Subscribe to score changes" },
];

const Developers = () => {
  const [tab, setTab] = useState("sdk");

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <AppHeader title="Developers" subtitle="Integrate Databook into your dApp" />

      <div className="flex-1 px-4 md:px-8 py-6 space-y-6">
        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Docs",    desc: "Full API reference" },
            { icon: Key,      title: "API keys",desc: "Manage and rotate" },
            { icon: Webhook,  title: "Webhooks",desc: "Score change events" },
          ].map((q) => (
            <Card key={q.title} className="rounded-2xl border-border/60 p-5 hover:border-border transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <q.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-display font-semibold text-foreground">{q.title}</p>
                  <p className="text-xs text-muted-foreground">{q.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Code samples */}
        <Card className="rounded-2xl border-border/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" /> Quickstart
              </h2>
              <p className="text-sm text-muted-foreground">TypeScript SDK or REST API.</p>
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="rounded-xl">
              <TabsTrigger value="sdk" className="rounded-lg">TypeScript SDK</TabsTrigger>
              <TabsTrigger value="rest" className="rounded-lg">REST: Score</TabsTrigger>
              <TabsTrigger value="verify" className="rounded-lg">REST: Verify proof</TabsTrigger>
            </TabsList>

            {[
              { v: "sdk",    snippet: SDK_SNIPPET },
              { v: "rest",   snippet: REST_SNIPPET },
              { v: "verify", snippet: VERIFY_SNIPPET },
            ].map((t) => (
              <TabsContent key={t.v} value={t.v} className="mt-4">
                <div className="relative">
                  <pre className="rounded-xl bg-muted border border-border/60 p-4 text-xs overflow-x-auto font-mono text-foreground">
                    <code>{t.snippet}</code>
                  </pre>
                  <Button
                    onClick={() => copy(t.snippet)}
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 h-7 px-2 text-xs rounded-lg"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Endpoints */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-4">API endpoints</h2>
          <div className="space-y-2">
            {endpoints.map((e) => (
              <div key={e.path} className="flex items-center gap-3 p-3 rounded-xl border border-border/40">
                <Badge
                  variant="outline"
                  className={
                    "rounded-md font-mono text-[10px] " +
                    (e.method === "GET"
                      ? "border-info/30 bg-info/10 text-info"
                      : "border-success/30 bg-success/10 text-success")
                  }
                >
                  {e.method}
                </Badge>
                <code className="text-sm font-mono text-foreground flex-1 truncate">{e.path}</code>
                <span className="text-xs text-muted-foreground hidden sm:inline">{e.description}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Pricing */}
        <Card className="rounded-2xl border-border/60 p-6">
          <h2 className="font-display text-xl font-bold mb-1">Pricing</h2>
          <p className="text-sm text-muted-foreground mb-4">Pay per query above your monthly tier.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {tiers.map((t, i) => (
              <Card
                key={t.name}
                className={
                  "rounded-2xl p-5 " +
                  (i === 1 ? "border-primary/40 bg-primary/5" : "border-border/60")
                }
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-display font-bold text-lg">{t.name}</h3>
                  {i === 1 && <Badge className="rounded-full bg-primary text-primary-foreground border-0">Popular</Badge>}
                </div>
                <p className="font-display text-3xl font-bold mb-1">{t.price}</p>
                <p className="text-xs text-muted-foreground mb-4">{t.queries}</p>
                <ul className="space-y-1.5 mb-4">
                  {t.features.map((f) => (
                    <li key={f} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">·</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={i === 1 ? "default" : "outline"} className="w-full rounded-xl">
                  Get started
                </Button>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Developers;
