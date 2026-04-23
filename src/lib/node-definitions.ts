import type { NodeDefinition, NodeCategory, SelectOption } from "@/types/workflow";
import {
  Clock,
  TrendingUp,
  ArrowLeftRight,
  Plus,
  Minus,
  Download,
  Upload,
  GitBranch,
  Bot,
  Sparkles,
  FileText,
  Edit3,
  Send,
  Bell,
  Mail,
  ArrowRightLeft,
} from "lucide-react";
import { createElement } from "react";

// ============= Shared Options =============

export const intervalOptions: SelectOption[] = [
  { value: "1m", label: "Every 1 minute" },
  { value: "5m", label: "Every 5 minutes" },
  { value: "15m", label: "Every 15 minutes" },
  { value: "30m", label: "Every 30 minutes" },
  { value: "1h", label: "Every 1 hour" },
  { value: "4h", label: "Every 4 hours" },
  { value: "12h", label: "Every 12 hours" },
  { value: "24h", label: "Every 24 hours" },
];

export const timezoneOptions: SelectOption[] = [
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Tokyo", label: "Tokyo" },
];

export const slippageOptions: SelectOption[] = [
  { value: "0.5", label: "0.5%" },
  { value: "1", label: "1%" },
  { value: "3", label: "3%" },
];

// ============= Node Definitions =============

export const nodeDefinitions: NodeDefinition[] = [
  // ===== TRIGGERS =====
  {
    id: "schedule-trigger",
    label: "Schedule",
    icon: createElement(Clock, { size: 14 }),
    category: "Trigger",
    inputCount: 0,
    outputCount: 1,
    color: "from-violet-500 to-purple-600",
    description: "Trigger workflow on a schedule",
    configFields: [
      { name: "interval", label: "Run Every", type: "select", options: intervalOptions },
      { name: "startTime", label: "Start Time (UTC)", type: "text", placeholder: "e.g. 09:00" },
      { name: "timezone", label: "Timezone", type: "select", options: timezoneOptions },
    ],
  },
  {
    id: "coinmarketcap",
    label: "Price Trigger",
    icon: createElement(TrendingUp, { size: 14 }),
    category: "Trigger",
    inputCount: 0,
    outputCount: 1,
    color: "from-cyan-500 to-teal-500",
    description: "Trigger when price conditions are met",
    configFields: [
      { name: "symbol", label: "Symbol", type: "text", placeholder: "e.g. BTC" },
      { 
        name: "condition", 
        label: "Condition", 
        type: "select", 
        options: [
          { value: "above", label: "Price Above" },
          { value: "below", label: "Price Below" },
          { value: "change", label: "% Change" },
        ]
      },
      { name: "price", label: "Price (USD)", type: "number", placeholder: "0.00" },
      { name: "interval", label: "Check Every", type: "select", options: intervalOptions },
    ],
  },

  // ===== DEFI - SWAP =====
  {
    id: "pancakeswap",
    label: "PancakeSwap",
    icon: createElement(ArrowLeftRight, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-amber-500 to-orange-500",
    description: "Swap tokens on PancakeSwap",
    configFields: [
      { name: "tokenIn", label: "Token In", type: "text", placeholder: "e.g. SUI" },
      { name: "tokenOut", label: "Token Out", type: "text", placeholder: "e.g. CAKE" },
      { name: "amount", label: "Amount", type: "number", placeholder: "0.0" },
      { name: "slippage", label: "Slippage %", type: "select", options: slippageOptions },
    ],
  },

  // ===== DEFI - LENDING (Venus) =====
  {
    id: "venus-supply",
    label: "Supply (Venus)",
    icon: createElement(Plus, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-emerald-500 to-green-600",
    description: "Supply assets to Venus Protocol",
    configFields: [
      { name: "asset", label: "Asset", type: "text", placeholder: "e.g. SUI, USDT" },
      { name: "amount", label: "Amount", type: "number", placeholder: "0.0" },
    ],
  },
  {
    id: "venus-borrow",
    label: "Borrow (Venus)",
    icon: createElement(Download, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-orange-500 to-red-500",
    description: "Borrow assets from Venus Protocol",
    configFields: [
      { name: "asset", label: "Asset", type: "text", placeholder: "e.g. USDT, USDC" },
      { name: "amount", label: "Amount", type: "number", placeholder: "0.0" },
    ],
  },
  {
    id: "venus-repay",
    label: "Repay (Venus)",
    icon: createElement(Upload, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-blue-500 to-cyan-500",
    description: "Repay borrowed assets on Venus",
    configFields: [
      { name: "asset", label: "Asset", type: "text", placeholder: "e.g. USDT, USDC" },
      { name: "amount", label: "Amount", type: "number", placeholder: "0.0 or 'max'" },
    ],
  },
  {
    id: "venus-withdraw",
    label: "Withdraw (Venus)",
    icon: createElement(Minus, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-rose-500 to-pink-500",
    description: "Withdraw supplied assets from Venus",
    configFields: [
      { name: "asset", label: "Asset", type: "text", placeholder: "e.g. SUI, USDT" },
      { name: "amount", label: "Amount", type: "number", placeholder: "0.0 or 'max'" },
    ],
  },

  // ===== DEFI - LIQUIDITY =====
  {
    id: "provide-liquidity",
    label: "Add Liquidity",
    icon: createElement(Plus, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-teal-500 to-emerald-500",
    description: "Add liquidity to a pool",
    configFields: [
      { name: "tokenA", label: "Token A", type: "text", placeholder: "e.g. SUI" },
      { name: "tokenB", label: "Token B", type: "text", placeholder: "e.g. CAKE" },
      { name: "amountA", label: "Amount A", type: "number", placeholder: "0.0" },
      { name: "amountB", label: "Amount B", type: "number", placeholder: "0.0" },
      { name: "slippage", label: "Slippage %", type: "select", options: slippageOptions },
    ],
  },
  {
    id: "remove-liquidity",
    label: "Remove Liquidity",
    icon: createElement(Minus, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-red-500 to-rose-600",
    description: "Remove liquidity from a pool",
    configFields: [
      { name: "tokenA", label: "Token A", type: "text", placeholder: "e.g. SUI" },
      { name: "tokenB", label: "Token B", type: "text", placeholder: "e.g. CAKE" },
      { name: "lpAmount", label: "LP Token Amount", type: "number", placeholder: "0.0 or 'max'" },
      { name: "slippage", label: "Slippage %", type: "select", options: slippageOptions },
    ],
  },
  
  // ===== DEFI - BRIDGE =====
  {
    id: "token-bridge",
    label: "Token Bridge",
    icon: createElement(ArrowRightLeft, { size: 14 }),
    category: "DeFi",
    inputCount: 1,
    outputCount: 1,
    color: "from-indigo-500 to-violet-500",
    description: "Bridge tokens across chains",
    configFields: [
      { name: "token", label: "Token", type: "text", placeholder: "e.g. SUI, USDT" },
      { name: "amount", label: "Amount", type: "number", placeholder: "0.0" },
      { 
        name: "fromChain", 
        label: "From Chain", 
        type: "select", 
        options: [
          { value: "sui", label: "Sui" },
          { value: "ethereum", label: "Ethereum" },
          { value: "polygon", label: "Polygon" },
          { value: "arbitrum", label: "Arbitrum" },
          { value: "optimism", label: "Optimism" },
        ]
      },
      { 
        name: "toChain", 
        label: "To Chain", 
        type: "select", 
        options: [
          { value: "sui", label: "Sui" },
          { value: "ethereum", label: "Ethereum" },
          { value: "polygon", label: "Polygon" },
          { value: "arbitrum", label: "Arbitrum" },
          { value: "optimism", label: "Optimism" },
        ]
      },
      { name: "recipient", label: "Recipient Address", type: "text", placeholder: "0x... (optional, defaults to sender)" },
    ],
  },

  // ===== LOGIC =====
  {
    id: "if-else",
    label: "If/Else",
    icon: createElement(GitBranch, { size: 14 }),
    category: "Logic",
    inputCount: 1,
    outputCount: 2,
    color: "from-purple-500 to-purple-600",
    description: "Branch workflow based on condition",
    configFields: [
      { name: "condition", label: "Condition", type: "text", placeholder: "e.g. value > 100" },
    ],
  },

  // ===== AI =====
  {
    id: "openai",
    label: "OpenAI",
    icon: createElement(Bot, { size: 14 }),
    category: "AI",
    inputCount: 1,
    outputCount: 1,
    color: "from-green-500 to-green-600",
    description: "Process data with OpenAI",
    configFields: [
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        options: [
          { value: "gpt-4", label: "GPT-4" },
          { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
        ]
      },
      { name: "prompt", label: "Prompt", type: "textarea", placeholder: "Enter your prompt" },
    ],
  },
  {
    id: "gemini",
    label: "Gemini",
    icon: createElement(Sparkles, { size: 14 }),
    category: "AI",
    inputCount: 1,
    outputCount: 1,
    color: "from-blue-400 to-indigo-500",
    description: "Process data with Google Gemini",
    configFields: [
      { 
        name: "model", 
        label: "Model", 
        type: "select", 
        options: [
          { value: "gemini-pro", label: "Gemini Pro" },
          { value: "gemini-ultra", label: "Gemini Ultra" },
        ]
      },
      { name: "prompt", label: "Prompt", type: "textarea", placeholder: "Enter your prompt" },
    ],
  },

  // ===== CONTRACT =====
  {
    id: "read-contract",
    label: "Read Contract",
    icon: createElement(FileText, { size: 14 }),
    category: "Contract",
    inputCount: 1,
    outputCount: 1,
    color: "from-slate-500 to-slate-600",
    description: "Read data from a smart contract",
    configFields: [
      { name: "address", label: "Contract Address", type: "text", placeholder: "0x..." },
      { name: "function", label: "Function Name", type: "text", placeholder: "e.g. balanceOf" },
      { name: "args", label: "Arguments (JSON)", type: "textarea", placeholder: '["0x..."]' },
    ],
  },
  {
    id: "write-contract",
    label: "Write Contract",
    icon: createElement(Edit3, { size: 14 }),
    category: "Contract",
    inputCount: 1,
    outputCount: 1,
    color: "from-rose-500 to-pink-500",
    description: "Write data to a smart contract",
    configFields: [
      { name: "address", label: "Contract Address", type: "text", placeholder: "0x..." },
      { name: "function", label: "Function Name", type: "text", placeholder: "e.g. transfer" },
      { name: "args", label: "Arguments (JSON)", type: "textarea", placeholder: '["0x...", "1000"]' },
      { name: "value", label: "Value (SUI)", type: "number", placeholder: "0.0" },
    ],
  },

  // ===== NOTIFICATION =====
  {
    id: "telegram",
    label: "Telegram",
    icon: createElement(Send, { size: 14 }),
    category: "Notification",
    inputCount: 1,
    outputCount: 1,
    color: "from-blue-500 to-blue-600",
    description: "Send Telegram notification",
    configFields: [
      { name: "chatId", label: "Chat ID", type: "text", placeholder: "e.g. -1001234567890" },
      { name: "message", label: "Message", type: "textarea", placeholder: "Enter message..." },
    ],
  },
  {
    id: "discord",
    label: "Discord",
    icon: createElement(Bell, { size: 14 }),
    category: "Notification",
    inputCount: 1,
    outputCount: 1,
    color: "from-indigo-500 to-purple-500",
    description: "Send Discord notification",
    configFields: [
      { name: "webhookUrl", label: "Webhook URL", type: "text", placeholder: "https://discord.com/api/webhooks/..." },
      { name: "message", label: "Message", type: "textarea", placeholder: "Enter message..." },
    ],
  },
  {
    id: "email",
    label: "Email",
    icon: createElement(Mail, { size: 14 }),
    category: "Notification",
    inputCount: 1,
    outputCount: 1,
    color: "from-rose-500 to-red-500",
    description: "Send email notification",
    configFields: [
      { name: "to", label: "To", type: "text", placeholder: "recipient@example.com" },
      { name: "subject", label: "Subject", type: "text", placeholder: "Workflow Alert" },
      { name: "message", label: "Message", type: "textarea", placeholder: "Enter email body..." },
    ],
  },
];

// ============= Helper Functions =============

export const getNodeDefinition = (definitionId: string): NodeDefinition | undefined => {
  return nodeDefinitions.find((def) => def.id === definitionId);
};

export const getNodesByCategory = (): Record<NodeCategory, NodeDefinition[]> => {
  return nodeDefinitions.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<NodeCategory, NodeDefinition[]>);
};

export const getCategoryColor = (category: NodeCategory): string => {
  const colors: Record<NodeCategory, string> = {
    Trigger: "from-violet-500 to-purple-600",
    DeFi: "from-amber-500 to-orange-500",
    Logic: "from-purple-500 to-purple-600",
    AI: "from-green-500 to-green-600",
    Contract: "from-slate-500 to-slate-600",
    Notification: "from-blue-500 to-blue-600",
  };
  return colors[category] || "from-gray-500 to-gray-600";
};
