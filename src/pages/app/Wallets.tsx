import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, 
  Plus, 
  Copy, 
  Eye, 
  Pencil, 
  X, 
  ExternalLink,
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronRight,
  Coins,
  Check,
  Loader2,
  Sparkles
} from "lucide-react";
import AppHeader from "@/components/app/AppHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types
interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
  change24h: number;
}

interface SmartWallet {
  id: string;
  name: string;
  address: string;
  emoji: string;
  permissions: string[];
  tokens: Token[];
  workflowCount: number;
}

// Mock data
const mockTokens: Token[] = [
  { symbol: "SUI", name: "SUI", balance: "2.4521", usdValue: "1,523.45", icon: "B", change24h: 2.34 },
  { symbol: "CAKE", name: "PancakeSwap", balance: "156.78", usdValue: "423.12", icon: "🥞", change24h: -1.23 },
  { symbol: "USDT", name: "Tether USD", balance: "500.00", usdValue: "500.00", icon: "₮", change24h: 0.01 },
  { symbol: "USDC", name: "USD Coin", balance: "250.00", usdValue: "250.00", icon: "◎", change24h: 0.02 },
  { symbol: "ETH", name: "Ethereum", balance: "0.125", usdValue: "312.50", icon: "Ξ", change24h: 1.87 },
  { symbol: "USDC", name: "Sui USDC", balance: "100.00", usdValue: "100.00", icon: "$", change24h: 0.00 },
  { symbol: "XRP", name: "Ripple", balance: "1,234.56", usdValue: "678.90", icon: "✕", change24h: -0.45 },
  { symbol: "ADA", name: "Cardano", balance: "2,500.00", usdValue: "1,125.00", icon: "₳", change24h: 3.21 },
];

const initialWallets: SmartWallet[] = [
  {
    id: "wallet-1",
    name: "My 1st Smart Wallet",
    address: "0x614EFbEE949E4cc0e846A432C8Ab297a49D18eb6",
    emoji: "🔥",
    permissions: ["Transfer", "Smart Contract"],
    tokens: [
      { symbol: "SUI", name: "SUI", balance: "0.5234", usdValue: "324.67", icon: "B", change24h: 2.34 },
      { symbol: "USDT", name: "Tether USD", balance: "100.00", usdValue: "100.00", icon: "₮", change24h: 0.01 },
    ],
    workflowCount: 0,
  },
];

const emojiOptions = ["🔥", "⚡", "🚀", "💎", "🌟", "🎯", "💰", "🦊", "🐻", "🦁", "🐯", "🦅"];

const Wallets = () => {
  const [wallets, setWallets] = useState<SmartWallet[]>(initialWallets);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [showTokensSidebar, setShowTokensSidebar] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<SmartWallet | null>(null);
  
  // Add wallet form state
  const [newWalletName, setNewWalletName] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState("🔥");
  const [isCreating, setIsCreating] = useState(false);
  
  // Deposit/Withdraw state
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState("SUI");
  const [isProcessing, setIsProcessing] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleCreateWallet = async () => {
    if (!newWalletName.trim()) {
      toast.error("Please enter a wallet name");
      return;
    }

    setIsCreating(true);
    
    // Simulate wallet creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newWallet: SmartWallet = {
      id: `wallet-${Date.now()}`,
      name: newWalletName,
      address: `0x${Math.random().toString(16).slice(2, 42)}`,
      emoji: selectedEmoji,
      permissions: ["Transfer", "Smart Contract"],
      tokens: [],
      workflowCount: 0,
    };
    
    setWallets([...wallets, newWallet]);
    setShowAddWallet(false);
    setNewWalletName("");
    setSelectedEmoji("🔥");
    setIsCreating(false);
    toast.success(`${newWalletName} created successfully!`);
  };

  const handleDeposit = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update wallet balance (mock)
    if (selectedWallet) {
      setWallets(wallets.map(w => {
        if (w.id === selectedWallet.id) {
          const existingToken = w.tokens.find(t => t.symbol === selectedToken);
          if (existingToken) {
            existingToken.balance = (parseFloat(existingToken.balance) + parseFloat(transferAmount)).toFixed(4);
          } else {
            w.tokens.push({
              symbol: selectedToken,
              name: selectedToken,
              balance: transferAmount,
              usdValue: "0.00",
              icon: selectedToken[0],
              change24h: 0,
            });
          }
        }
        return w;
      }));
    }
    
    setIsProcessing(false);
    setShowDepositDialog(false);
    setTransferAmount("");
    toast.success(`Deposited ${transferAmount} ${selectedToken} successfully!`);
  };

  const handleWithdraw = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowWithdrawDialog(false);
    setTransferAmount("");
    toast.success(`Withdrawn ${transferAmount} ${selectedToken} successfully!`);
  };

  const totalBalance = mockTokens.reduce((sum, t) => sum + parseFloat(t.usdValue.replace(",", "")), 0);

  return (
    <>
      <AppHeader title="Wallets" />
      
      <div className="flex-1 overflow-auto px-4 md:px-8 pb-8">
        {/* Connected Wallet & Balance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-outlined p-5 md:p-8"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-base md:text-lg font-semibold text-foreground mb-4 md:mb-6">
                  Connected Wallet
                </h2>
                
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Address</p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs md:text-sm text-foreground font-mono">0xf6eb...2173c</code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 rounded-lg hover:bg-muted/50"
                          onClick={() => copyToClipboard("0xf6eb1b94b2511851c5e8fbfae8b5c8890c22173c")}
                        >
                          <Copy size={14} className="text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-muted/50">
                          <ExternalLink size={14} className="text-muted-foreground" />
                        </Button>
                      </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Provider</p>
                    <p className="text-sm text-foreground">MetaMask</p>
                  </div>
                </div>
              </div>
              
              <div className="h-12 w-12 md:h-16 md:w-16 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                <span className="text-2xl md:text-3xl">🦊</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-outlined p-5 md:p-8"
          >
            <h2 className="font-display text-base md:text-lg font-semibold text-foreground mb-4 md:mb-6">
              Wallet Balance
            </h2>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0">
                  <Coins className="h-6 w-6 md:h-7 md:w-7 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-1">Total Value</p>
                  <p className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
              
              <div className="sm:text-right">
                <p className="text-xs md:text-sm text-muted-foreground mb-2">{mockTokens.length} tokens</p>
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground hover:text-foreground gap-1 p-0 h-auto"
                  onClick={() => setShowTokensSidebar(true)}
                >
                  Show All Tokens
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Smart Wallets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 md:mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <div>
              <h2 className="font-display text-lg md:text-xl font-semibold text-foreground mb-1">
                Smart Wallets
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Manage your smart wallets for workflows.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="gap-2 rounded-xl border-border/60 hover:border-border w-full sm:w-auto"
              onClick={() => setShowAddWallet(true)}
            >
              <Plus size={16} />
              Add Smart Wallet
            </Button>
          </div>
        </motion.div>

        {/* Smart Wallet Cards */}
        <div className="space-y-4 md:space-y-6">
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="card-outlined p-5 md:p-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6 md:mb-8">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xl md:text-2xl">{wallet.emoji}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-base md:text-lg text-foreground mb-2">{wallet.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-muted-foreground">Address:</p>
                        <code className="text-xs text-foreground font-mono">
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 rounded hover:bg-muted/50"
                          onClick={() => copyToClipboard(wallet.address)}
                        >
                          <Copy size={10} className="text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-muted-foreground">Permissions:</p>
                        {wallet.permissions.map((perm) => (
                          <Badge key={perm} variant="outline" className="text-xs border-border/60">{perm}</Badge>
                        ))}
                        <Button variant="ghost" size="icon" className="h-5 w-5 rounded hover:bg-muted/50">
                          <Pencil size={10} className="text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-outlined p-4 md:p-5 w-full lg:w-auto lg:min-w-[280px]">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-medium text-foreground">Balance</h4>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-foreground hover:bg-muted/50 h-7 px-2 text-xs gap-1"
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setShowDepositDialog(true);
                        }}
                      >
                        <ArrowDownToLine size={12} />
                        Deposit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs gap-1"
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setShowWithdrawDialog(true);
                        }}
                      >
                        <ArrowUpFromLine size={12} />
                        Withdraw
                      </Button>
                    </div>
                  </div>
                  
                  {wallet.tokens.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground">No tokens yet</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-2 text-foreground hover:bg-muted/50"
                        onClick={() => {
                          setSelectedWallet(wallet);
                          setShowDepositDialog(true);
                        }}
                      >
                        Add funds
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wallet.tokens.slice(0, 3).map((token) => (
                        <div key={token.symbol} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                              <span className="text-xs font-bold text-foreground">{token.icon}</span>
                            </div>
                            <span className="text-sm text-foreground">{token.symbol}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">{token.balance}</p>
                            <p className="text-xs text-muted-foreground">${token.usdValue}</p>
                          </div>
                        </div>
                      ))}
                      {wallet.tokens.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center pt-2">
                          +{wallet.tokens.length - 3} more tokens
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Workflows Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-foreground">Workflows ({wallet.workflowCount})</h4>
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    View All
                  </Button>
                </div>

                <div className="card-outlined overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead>Name</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Chain</TableHead>
                        <TableHead>Trigger</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={6} className="h-40">
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 rounded-2xl bg-muted/30 flex items-center justify-center mb-4">
                              <X size={28} className="text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground mb-5">
                              No workflows found. Start by creating a new workflow.
                            </p>
                            <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                              <Plus size={16} />
                              Create Workflow
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Smart Wallet Dialog */}
      <Dialog open={showAddWallet} onOpenChange={setShowAddWallet}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-foreground" />
              Create Smart Wallet
            </DialogTitle>
            <DialogDescription>
              Smart wallets enable automated transactions for your workflows.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label>Choose an emoji</Label>
              <div className="flex flex-wrap gap-2">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={cn(
                      "h-12 w-12 rounded-xl flex items-center justify-center text-2xl transition-all border",
                      selectedEmoji === emoji 
                        ? "border-foreground bg-muted" 
                        : "border-border/60 hover:border-border hover:bg-muted/30"
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input
                id="wallet-name"
                placeholder="e.g. Trading Wallet"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                className="h-11"
              />
            </div>
            
            <div className="card-outlined p-4 space-y-3">
              <h4 className="text-sm font-medium text-foreground">Permissions</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Transfer tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Execute smart contracts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-sm text-muted-foreground">Approve token spending</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddWallet(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateWallet}
              disabled={isCreating}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isCreating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Create Wallet
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5 text-foreground" />
              Deposit to {selectedWallet?.name}
            </DialogTitle>
            <DialogDescription>
              Transfer tokens from your connected wallet to this smart wallet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Token</Label>
              <div className="flex gap-2">
                {["SUI", "USDT", "CAKE"].map((token) => (
                  <button
                    key={token}
                    onClick={() => setSelectedToken(token)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                      selectedToken === token
                        ? "border-foreground bg-muted text-foreground"
                        : "border-border/60 text-muted-foreground hover:border-border"
                    )}
                  >
                    {token}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="deposit-amount">Amount</Label>
                <span className="text-xs text-muted-foreground">
                  Available: 2.4521 {selectedToken}
                </span>
              </div>
              <div className="relative">
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="h-11 pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-foreground"
                  onClick={() => setTransferAmount("2.4521")}
                >
                  MAX
                </Button>
              </div>
            </div>
            
            <div className="card-outlined p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground">~0.0005 SUI</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Time</span>
                <span className="text-foreground">~3 seconds</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDepositDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit}
              disabled={isProcessing}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownToLine size={16} />
                  Deposit
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUpFromLine className="h-5 w-5 text-foreground" />
              Withdraw from {selectedWallet?.name}
            </DialogTitle>
            <DialogDescription>
              Transfer tokens from this smart wallet back to your connected wallet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Token</Label>
              <div className="flex gap-2">
                {selectedWallet?.tokens.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => setSelectedToken(token.symbol)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                      selectedToken === token.symbol
                        ? "border-foreground bg-muted text-foreground"
                        : "border-border/60 text-muted-foreground hover:border-border"
                    )}
                  >
                    {token.symbol}
                  </button>
                )) || (
                  <p className="text-sm text-muted-foreground">No tokens available</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="withdraw-amount">Amount</Label>
                <span className="text-xs text-muted-foreground">
                  Available: {selectedWallet?.tokens.find(t => t.symbol === selectedToken)?.balance || "0"} {selectedToken}
                </span>
              </div>
              <div className="relative">
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="0.00"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="h-11 pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 text-xs text-foreground"
                  onClick={() => {
                    const token = selectedWallet?.tokens.find(t => t.symbol === selectedToken);
                    if (token) setTransferAmount(token.balance);
                  }}
                >
                  MAX
                </Button>
              </div>
            </div>
            
            <div className="card-outlined p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Destination</span>
                <span className="text-foreground font-mono text-xs">0xf6eb...2173c</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Network Fee</span>
                <span className="text-foreground">~0.0005 SUI</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleWithdraw}
              disabled={isProcessing || !selectedWallet?.tokens.length}
              className="gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpFromLine size={16} />
                  Withdraw
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tokens Sidebar */}
      <Sheet open={showTokensSidebar} onOpenChange={setShowTokensSidebar}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-muted-foreground" />
              All Tokens
            </SheetTitle>
            <SheetDescription>
              Your connected wallet token holdings
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-display font-bold text-foreground">
                  ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Badge variant="outline" className="bg-muted/50 text-foreground border-border/60">
                {mockTokens.length} tokens
              </Badge>
            </div>
            
            <ScrollArea className="h-[calc(100vh-220px)]">
              <div className="space-y-3 pr-4">
                {mockTokens.map((token) => (
                  <div 
                    key={token.symbol}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:border-border transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                        <span className="text-lg font-bold text-foreground">{token.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{token.balance}</p>
                      <div className="flex items-center justify-end gap-1">
                        <p className="text-xs text-muted-foreground">${token.usdValue}</p>
                        <span className={cn(
                          "text-xs",
                          token.change24h > 0 ? "text-emerald-400" : token.change24h < 0 ? "text-red-400" : "text-muted-foreground"
                        )}>
                          {token.change24h > 0 ? "+" : ""}{token.change24h}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Wallets;
