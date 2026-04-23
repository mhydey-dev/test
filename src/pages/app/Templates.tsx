import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles, ArrowRight, Clock, Wand2 } from "lucide-react";
import AppHeader from "@/components/app/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import type { TemplateCardInfo } from "@/types/workflow";

interface TemplateDisplay extends TemplateCardInfo {
  chains: string[];
  steps: string[];
  setupTime: string;
}

const templates: TemplateDisplay[] = [
  {
    id: "price-alert-telegram",
    name: "Price Alert to Telegram",
    description: "Get notified on Telegram when a token reaches your target price",
    chains: ["Sui"],
    category: "Notifications",
    uses: 2847,
    steps: [
      "Monitor token price on CoinMarketCap",
      "Trigger when price reaches target threshold",
      "Send notification via Telegram",
    ],
    setupTime: "2 minutes",
  },
  {
    id: "conditional-swap",
    name: "Conditional Token Swap",
    description: "Swap tokens automatically based on price conditions",
    chains: ["Sui"],
    category: "DeFi",
    uses: 1523,
    steps: [
      "Monitor price on CoinMarketCap",
      "Check condition with If/Else logic",
      "Execute swap on PancakeSwap if conditions met",
    ],
    setupTime: "3 minutes",
  },
  {
    id: "ai-analysis-trade",
    name: "AI-Powered Trading",
    description: "Use AI to analyze market conditions before executing trades",
    chains: ["Sui"],
    category: "DeFi",
    uses: 892,
    steps: [
      "Fetch token data from CoinMarketCap",
      "Use OpenAI to analyze market sentiment",
      "Execute trade on PancakeSwap based on AI recommendation",
    ],
    setupTime: "5 minutes",
  },
  {
    id: "contract-monitor",
    name: "Smart Contract Monitor",
    description: "Monitor contract state and notify on changes with AI analysis",
    chains: ["Sui"],
    category: "DeFi",
    uses: 634,
    steps: [
      "Read contract data regularly",
      "Analyze changes with Gemini AI",
      "Send alerts via Telegram",
    ],
    setupTime: "5 minutes",
  },
  {
    id: "dca-strategy",
    name: "DCA Bot",
    description: "Dollar-cost averaging strategy with automatic swaps",
    chains: ["Sui"],
    category: "DeFi",
    uses: 2156,
    steps: [
      "Execute periodic swaps on PancakeSwap",
      "Buy fixed amount at regular intervals",
      "Receive confirmation via Telegram",
    ],
    setupTime: "3 minutes",
  },
  {
    id: "arbitrage-detector",
    name: "Arbitrage Detector",
    description: "Detect price differences and execute arbitrage trades",
    chains: ["Sui"],
    category: "DeFi",
    uses: 445,
    steps: [
      "Monitor DEX prices via contract reads",
      "Compare with CEX prices",
      "Execute arbitrage when profitable",
    ],
    setupTime: "7 minutes",
  },
  {
    id: "scheduled-balance-check",
    name: "Scheduled Balance Check",
    description: "Check wallet balance on a schedule and notify if low",
    chains: ["Sui"],
    category: "Automation",
    uses: 1087,
    steps: [
      "Schedule balance check at regular intervals",
      "Read wallet balance from contract",
      "Alert if balance falls below threshold",
    ],
    setupTime: "2 minutes",
  },
];

const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const formatUses = (uses: number) => {
    if (uses >= 1000) {
      return `${(uses / 1000).toFixed(1)}k`;
    }
    return uses.toString();
  };

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "DeFi":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Utility":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "NFT":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      <AppHeader title="Templates" />
      
      <div className="flex-1 overflow-auto px-4 md:px-8 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
          {/* Start From Scratch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-outlined p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
                <Plus size={20} className="text-primary md:w-6 md:h-6" />
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Start From Scratch
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
              Ready to build your custom automation? Create a workflow tailored to your needs.
            </p>
            <Button 
              onClick={() => navigate("/app/builder")}
              className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto"
            >
              <Plus size={16} />
              Start Building
            </Button>
          </motion.div>

          {/* Automation Copilot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-outlined p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Wand2 size={20} className="text-primary md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    AI Copilot
                  </h2>
                  <Badge variant="outline" className="mt-1 text-xs border-primary/30 text-primary">
                    Coming Soon
                  </Badge>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                Describe what you want to automate and let AI build it for you.
              </p>
              
              <div className="relative">
                <Input
                  placeholder="Describe your automation..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="pr-24 rounded-xl border-border/60 bg-background/50"
                  disabled
                />
                <Button 
                  size="sm" 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 gap-1.5 rounded-lg"
                  disabled
                >
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">Generate</span>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Templates */}
        <div>
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
                Featured Templates
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Pre-built automations to get you started quickly.
              </p>
            </div>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground gap-1 hidden sm:flex">
              View All
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {templates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() => setSelectedTemplate(template)}
                className={`card-outlined-hover p-5 md:p-6 cursor-pointer`}
              >
                <h3 className="font-display font-semibold text-foreground mb-2 md:mb-3 line-clamp-2">
                  {template.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2">
                  {template.description}
                </p>
                <p className="text-xs text-muted-foreground/70 mb-3 md:mb-4">
                  <span className="font-medium text-foreground">{formatUses(template.uses)}</span> uses
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {template.chains.map((chain) => (
                    <Badge 
                      key={chain} 
                      variant="outline" 
                      className="text-xs bg-muted/50 text-foreground border-border/60"
                    >
                      {chain}
                    </Badge>
                  ))}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCategoryStyle(template.category)}`}
                  >
                    {template.category}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Detail Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl glass-panel-strong border-border/60 rounded-2xl mx-4">
          <DialogHeader>
            <DialogTitle className="font-display text-xl md:text-2xl">
              {selectedTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 md:space-y-5">
            <p className="text-sm md:text-base text-muted-foreground">
              {selectedTemplate?.description}
            </p>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} className="text-primary" />
              <span>Setup time: {selectedTemplate?.setupTime}</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {selectedTemplate?.chains.map((chain) => (
                <Badge 
                  key={chain} 
                  variant="outline" 
                  className="bg-muted/50 text-foreground border-border/60"
                >
                  {chain}
                </Badge>
              ))}
            </div>
            
            {selectedTemplate?.steps && selectedTemplate.steps.length > 0 && (
              <div className="space-y-3 pt-4 md:pt-5 border-t border-border/50">
                <h4 className="font-medium text-foreground">How it works</h4>
                {selectedTemplate.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-foreground">{i + 1}</span>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button 
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
                className="rounded-xl order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setSelectedTemplate(null);
                  navigate(`/app/builder?template=${selectedTemplate?.id}`);
                }}
                className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground order-1 sm:order-2"
              >
                Use Template
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Templates;
