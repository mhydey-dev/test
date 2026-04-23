import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, Plus, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/app/MobileNav";
import { Link } from "react-router-dom";

interface AppHeaderProps {
  title: string;
}

const AppHeader = ({ title }: AppHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8"
    >
      {/* Left side - Mobile nav + Title */}
      <div className="flex items-center gap-3">
        <MobileNav />
        
        {/* Mobile Logo */}
        <Link to="/" className="flex items-center gap-2 md:hidden">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
        </Link>
        
        <h1 className="font-display text-lg md:text-2xl font-bold text-foreground">{title}</h1>
      </div>
      
      {/* Right side actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop only buttons */}
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden lg:flex gap-2 rounded-xl border-border/60 hover:border-border hover:bg-muted/50"
        >
          <Plus size={16} />
          Create Workflow
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden sm:flex gap-2 rounded-xl border-border/60 hover:border-border hover:bg-muted/50"
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="hidden md:inline">Sui</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </Button>

        <ThemeToggle />
        
        <Button size="sm" className="gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
          <Wallet size={16} />
          <span className="hidden sm:inline">Connect Wallet</span>
        </Button>
      </div>
    </motion.header>
  );
};

export default AppHeader;
