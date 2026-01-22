import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRunSimulation } from "@/hooks/use-queries";
import { Loader2, ArrowRightLeft, Settings2, AlertTriangle, Terminal } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveToolProps {
  querySlug: string;
  recommendedActions: string[];
}

export function InteractiveTool({ querySlug, recommendedActions }: InteractiveToolProps) {
  const { mutate: runSimulation, isPending, data: simulationResult } = useRunSimulation();
  
  const [tokenIn, setTokenIn] = useState("1.0");
  const [slippage, setSlippage] = useState([0.5]);
  
  const handleAction = (action: string) => {
    runSimulation({
      querySlug,
      action,
      slippage: slippage[0].toString(),
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Simulation Control Panel */}
      <Card className="border-primary/20 bg-card shadow-2xl shadow-black/40">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Transaction Simulator
            </CardTitle>
            <div className="text-xs font-mono text-muted-foreground">READY_STATE</div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {/* Swap UI Mock */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-mono">Sell Amount (ETH)</Label>
              <div className="relative">
                <Input 
                  value={tokenIn}
                  onChange={(e) => setTokenIn(e.target.value)}
                  className="bg-secondary/50 border-border font-mono text-lg h-12 pr-16 focus:ring-primary/20 focus:border-primary"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 px-2 py-1 rounded text-xs font-bold text-foreground">
                  ETH
                </div>
              </div>
            </div>

            <div className="flex justify-center -my-2 relative z-10">
              <div className="bg-card border border-border rounded-full p-2 text-muted-foreground">
                <ArrowRightLeft className="h-4 w-4 rotate-90" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground font-mono">Buy Amount (USDC)</Label>
              <div className="relative">
                <Input 
                  value={(parseFloat(tokenIn || "0") * 3200).toFixed(2)}
                  readOnly
                  className="bg-secondary/20 border-border font-mono text-lg h-12 pr-16 text-muted-foreground"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 px-2 py-1 rounded text-xs font-bold text-muted-foreground">
                  USDC
                </div>
              </div>
            </div>
          </div>

          {/* Slippage Settings */}
          <div className="bg-secondary/30 p-4 rounded-lg border border-border/50 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-xs font-mono">
                <Settings2 className="h-3 w-3" />
                Max Slippage
              </Label>
              <span className="font-mono text-xs text-primary">{slippage}%</span>
            </div>
            <Slider 
              value={slippage} 
              onValueChange={setSlippage} 
              max={10} 
              step={0.1}
              className="py-2" 
            />
            {slippage[0] > 2 && (
              <div className="flex items-center gap-2 text-orange-500 text-xs font-mono animate-pulse">
                <AlertTriangle className="h-3 w-3" />
                High slippage risk: Front-running likely
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-6 border-t border-border/50 bg-secondary/10">
          <p className="text-xs text-muted-foreground font-mono mb-2 w-full text-center">
            RECOMMENDED ACTIONS
          </p>
          <div className="flex gap-3 w-full">
            {recommendedActions.map((action) => (
              <Button 
                key={action}
                onClick={() => handleAction(action)}
                disabled={isPending}
                className="flex-1 font-mono font-bold tracking-wider relative overflow-hidden group"
                variant={action === "revoke" ? "destructive" : "default"}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {action.toUpperCase()}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </Button>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Simulation Results Terminal */}
      <Card className="bg-black border-border/50 font-mono text-sm shadow-2xl flex flex-col h-full min-h-[400px]">
        <div className="flex items-center gap-2 p-3 border-b border-border/30 bg-secondary/20">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
          <span className="ml-2 text-xs text-muted-foreground">simulation_output.log</span>
        </div>
        
        <div className="flex-1 p-4 overflow-hidden relative">
          <AnimatePresence mode="wait">
            {!simulationResult && !isPending && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-muted-foreground/50 h-full flex items-center justify-center text-center p-8"
              >
                <div>
                  <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Awaiting input...</p>
                  <p className="text-xs mt-2">Configure simulation parameters and execute action.</p>
                </div>
              </motion.div>
            )}

            {isPending && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2 text-primary/80"
              >
                <p>&gt; Initializing VM...</p>
                <p>&gt; Forking mainnet state at block latest...</p>
                <p>&gt; Simulating transaction execution...</p>
                <span className="inline-block w-2 h-4 bg-primary animate-cursor-blink align-middle ml-1" />
              </motion.div>
            )}

            {simulationResult && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className={`p-3 border rounded ${
                  simulationResult.success 
                    ? "border-green-500/30 bg-green-500/10 text-green-400" 
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}>
                  <p className="font-bold flex items-center gap-2">
                    STATUS: {simulationResult.success ? "SUCCESS" : "FAILED"}
                    {simulationResult.success && <span className="text-xs bg-green-500/20 px-2 py-0.5 rounded text-green-300">CONFIRMED</span>}
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-2 bg-secondary/20 rounded">
                      <span className="text-muted-foreground block mb-1">GAS USED</span>
                      <span className="text-primary">{simulationResult.gasUsed}</span>
                    </div>
                    {simulationResult.txHash && (
                      <div className="p-2 bg-secondary/20 rounded">
                        <span className="text-muted-foreground block mb-1">TX HASH</span>
                        <span className="text-primary truncate">{simulationResult.txHash}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">EXECUTION LOG:</p>
                  <pre className="text-xs text-secondary-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {simulationResult.simulationLog}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}
