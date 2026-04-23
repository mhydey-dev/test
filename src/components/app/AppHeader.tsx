import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileNav } from "@/components/app/MobileNav";
import { Link } from "react-router-dom";
import { ConnectButton } from "@mysten/dapp-kit-react/ui";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

const AppHeader = ({ title, subtitle }: AppHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-30 h-16 md:h-20 flex items-center justify-between px-4 md:px-8 bg-background/20 backdrop-blur-md"
    >
      <div className="flex items-center gap-3">
        <MobileNav />

        <Link to="/" className="flex items-center gap-2 md:hidden">
          <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
        </Link>

        <div className="flex flex-col">
          <h1 className="font-display text-lg md:text-2xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden md:block text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 rounded-xl border-border/60 hover:border-border hover:bg-muted/50"
        >
          <div className="h-2 w-2 rounded-full bg-success" />
          <span className="hidden md:inline">SUI</span>
          <ChevronDown size={14} className="text-muted-foreground" />
        </Button>

        <ThemeToggle />

        <ConnectButton />
      </div>
    </motion.header>
  );
};

export default AppHeader;
