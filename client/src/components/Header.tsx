import { Link, useLocation } from "wouter";
import { Wallet, Activity, Terminal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [location] = useLocation();
  const [isConnected, setIsConnected] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
              <Terminal className="h-5 w-5 text-primary" />
            </div>
            <span className="font-mono font-bold text-lg tracking-tight hidden sm:inline-block">
              DeFi<span className="text-primary">Sim</span>.OS
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className={location === "/" ? "text-primary text-glow" : "text-muted-foreground hover:text-foreground transition-colors"}>
              Dashboard
            </Link>
            <Link href="/history" className={location === "/history" ? "text-primary text-glow" : "text-muted-foreground hover:text-foreground transition-colors"}>
              History
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Ethereum Mainnet
          </div>
          
          <Button 
            variant={isConnected ? "outline" : "default"}
            className={isConnected ? "border-primary/50 text-primary hover:bg-primary/10 font-mono" : "bg-primary text-primary-foreground hover:bg-primary/90 font-mono font-bold"}
            onClick={() => setIsConnected(!isConnected)}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnected ? "0x7B...3A9F" : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </header>
  );
}
