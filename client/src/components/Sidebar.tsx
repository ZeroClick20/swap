import { useQueries } from "@/hooks/use-queries";
import { Link, useLocation } from "wouter";
import { AlertTriangle, BarChart2, ShieldCheck, ChevronRight, Hash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

export function Sidebar() {
  const { data: queries, isLoading } = useQueries();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="w-64 h-[calc(100vh-4rem)] border-r border-border bg-card/30 p-4 hidden lg:block">
        <Skeleton className="h-4 w-32 mb-6 bg-secondary" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full bg-secondary/50" />
          ))}
        </div>
      </div>
    );
  }

  // Group queries by pageType
  const grouped = queries?.reduce((acc, query) => {
    const type = query.pageType || 'other';
    if (!acc[type]) acc[type] = [];
    acc[type].push(query);
    return acc;
  }, {} as Record<string, typeof queries>) || {};

  const typeLabels: Record<string, { label: string, icon: React.ReactNode }> = {
    error_resolution: { label: "Error Resolution", icon: <AlertTriangle className="h-4 w-4 text-orange-500" /> },
    dashboard: { label: "Market Data", icon: <BarChart2 className="h-4 w-4 text-blue-500" /> },
    tool: { label: "Tools", icon: <Hash className="h-4 w-4 text-primary" /> },
    network_tool: { label: "Network Tools", icon: <ShieldCheck className="h-4 w-4 text-purple-500" /> },
  };

  return (
    <aside className="w-64 h-[calc(100vh-4rem)] border-r border-border bg-card/30 hidden lg:block sticky top-16">
      <ScrollArea className="h-full py-6">
        <div className="px-4 mb-6">
          <h2 className="text-xs font-mono uppercase text-muted-foreground tracking-wider mb-1">Navigation</h2>
        </div>
        
        <div className="space-y-6 px-3">
          {Object.entries(grouped).map(([type, items]) => (
            <div key={type} className="space-y-1">
              <h3 className="px-2 text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                {typeLabels[type]?.icon || <Hash className="h-4 w-4" />}
                {typeLabels[type]?.label || type}
              </h3>
              
              <div className="space-y-0.5">
                {items?.map((query) => {
                  const isActive = location === `/query/${query.slug}`;
                  return (
                    <Link key={query.id} href={`/query/${query.slug}`}>
                      <div className={`
                        group flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer
                        ${isActive 
                          ? "bg-primary/10 text-primary font-medium border border-primary/20" 
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        }
                      `}>
                        <span className="truncate">{query.intent}</span>
                        {isActive && (
                          <motion.div layoutId="sidebar-active" transition={{ duration: 0.2 }}>
                            <ChevronRight className="h-3 w-3" />
                          </motion.div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
