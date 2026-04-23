import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const MobileBlocker = () => {
  return (
    <div className="md:hidden flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="h-20 w-20 rounded-2xl bg-muted/30 flex items-center justify-center mb-6">
        <Monitor size={40} className="text-muted-foreground" />
      </div>
      
      <h2 className="font-display text-xl font-semibold text-foreground mb-3">
        Desktop Required
      </h2>
      
      <p className="text-muted-foreground mb-8 max-w-sm">
        The workflow builder requires a larger screen for the best experience. 
        Please open this page on a desktop or tablet device.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link to="/app/templates" className="w-full">
          <Button className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
            Browse Templates
          </Button>
        </Link>
        <Link to="/app" className="w-full">
          <Button variant="outline" className="w-full gap-2 rounded-xl">
            Go to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mt-10 flex items-center gap-3 text-xs text-muted-foreground">
        <Smartphone size={14} />
        <span>You're viewing on a mobile device</span>
      </div>
    </div>
  );
};
