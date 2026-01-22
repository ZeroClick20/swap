import { useMarketStatus } from "@/hooks/use-queries";
import { Card } from "@/components/ui/card";
import { Activity, Zap, Layers, DollarSign } from "lucide-react";

export function MarketStats() {
  const { data: status } = useMarketStatus();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="p-4 bg-secondary/30 border-primary/10 backdrop-blur-sm hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono uppercase">Gas Price</p>
            <p className="text-xl font-mono font-bold text-foreground">
              {status?.gasPrice || "..."} <span className="text-sm text-muted-foreground">Gwei</span>
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-secondary/30 border-primary/10 backdrop-blur-sm hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono uppercase">ETH Price</p>
            <p className="text-xl font-mono font-bold text-foreground">
              ${status?.ethPrice || "..."}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-secondary/30 border-primary/10 backdrop-blur-sm hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono uppercase">Block Height</p>
            <p className="text-xl font-mono font-bold text-foreground">
              #{status?.blockNumber?.toLocaleString() || "..."}
            </p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-secondary/30 border-primary/10 backdrop-blur-sm hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            status?.congestion === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
          }`}>
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-mono uppercase">Congestion</p>
            <p className="text-xl font-mono font-bold text-foreground uppercase">
              {status?.congestion || "Low"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
