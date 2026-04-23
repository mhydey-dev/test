import { motion } from "framer-motion";
import { Zap, Activity, Play, FileText, Wallet, TrendingUp, ArrowUpRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import AppHeader from "@/components/app/AppHeader";
import { Button } from "@/components/ui/button";

const statsCards = [
  { title: "Total Workflows", value: "—", icon: Zap, trend: null },
  { title: "Active Workflows", value: "—", icon: Activity, trend: null },
  { title: "Total Runs", value: "—", icon: Play, trend: null },
  { title: "Drafts", value: "—", icon: FileText, trend: null },
];

const gasData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 600 },
  { name: "Mar", value: 800 },
  { name: "Apr", value: 1200 },
  { name: "May", value: 1800 },
  { name: "Jun", value: 2400 },
  { name: "Jul", value: 2800 },
];

const portfolioData = [
  { name: "W1", value: 1200 },
  { name: "W2", value: 800 },
  { name: "W3", value: 1500 },
  { name: "W4", value: 2000 },
  { name: "W5", value: 1800 },
  { name: "W6", value: 2200 },
  { name: "W7", value: 1600 },
  { name: "W8", value: 2800 },
  { name: "W9", value: 2400 },
  { name: "W10", value: 3000 },
  { name: "W11", value: 2600 },
  { name: "W12", value: 3200 },
];

const assetData = [
  { name: "SUI", value: 45, color: "hsl(220 10% 70%)" },
  { name: "USDT", value: 30, color: "hsl(220 10% 50%)" },
  { name: "Other", value: 25, color: "hsl(220 10% 35%)" },
];

const Dashboard = () => {
  return (
    <>
      <AppHeader title="Dashboard" />
      
      <div className="flex-1 overflow-auto px-4 md:px-8 pb-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
          {statsCards.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="stat-card group hover-glow"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                  <stat.icon size={18} className="text-muted-foreground md:w-5 md:h-5" />
                </div>
                {stat.trend && (
                  <div className="flex items-center gap-1 text-xs text-foreground/70">
                    <ArrowUpRight size={12} />
                    {stat.trend}
                  </div>
                )}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl md:text-3xl font-display font-bold text-foreground">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">
          {/* Gas Saved Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-outlined p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="text-xs md:text-sm text-muted-foreground mb-1">Total Gas Saved</h3>
                <p className="text-xl md:text-2xl font-display font-bold text-foreground">$ —</p>
              </div>
              <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
                <TrendingUp size={16} className="text-muted-foreground" />
              </div>
            </div>
            <div className="h-32 md:h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gasData}>
                  <defs>
                    <linearGradient id="gasGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(220 10% 60%)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(220 10% 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(220 10% 60%)"
                    strokeWidth={2}
                    fill="url(#gasGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Portfolio Value Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card-outlined p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="text-xs md:text-sm text-muted-foreground mb-1">Portfolio Value</h3>
                <p className="text-xl md:text-2xl font-display font-bold text-foreground">$ —</p>
              </div>
            </div>
            <div className="h-32 md:h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={portfolioData}>
                  <Bar dataKey="value" fill="hsl(220 10% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Asset Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card-outlined p-4 md:p-6 md:col-span-2 lg:col-span-1"
          >
            <h3 className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">Asset Distribution</h3>
            <div className="h-36 md:h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 md:gap-6 mt-2">
              {assetData.map((asset) => (
                <div key={asset.name} className="flex items-center gap-2">
                  <div 
                    className="h-2 w-2 rounded-full" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-xs text-muted-foreground">{asset.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Active Workflows Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card-outlined p-6 md:p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                <Zap size={18} className="text-muted-foreground md:w-5 md:h-5" />
              </div>
              <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">Active Workflows</h2>
            </div>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
              View All
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4 md:mb-6">
              <Wallet size={28} className="text-muted-foreground md:w-8 md:h-8" />
            </div>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-md px-4">
              Connect your wallet to view and manage your active workflows.
            </p>
            <Button className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
              <Wallet size={16} />
              Connect Wallet
            </Button>
          </div>
        </motion.div>

        {/* Drafts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card-outlined p-6 md:p-8"
        >
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-muted/50 flex items-center justify-center">
                <FileText size={18} className="text-muted-foreground md:w-5 md:h-5" />
              </div>
              <h2 className="font-display text-lg md:text-xl font-semibold text-foreground">Drafts</h2>
            </div>
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
              View All
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-4 md:mb-6">
              <FileText size={28} className="text-muted-foreground md:w-8 md:h-8" />
            </div>
            <p className="text-sm md:text-base text-muted-foreground px-4">
              No drafts yet. Create your first workflow to get started.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;
