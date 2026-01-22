import { useQueries } from "@/hooks/use-queries";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { MarketStats } from "@/components/MarketStats";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Search, Activity, Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: queries, isLoading } = useQueries();
  const [search, setSearch] = useState("");

  const filteredQueries = queries?.filter(q => 
    q.rawQuery.toLowerCase().includes(search.toLowerCase()) || 
    q.intent.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background bg-grid-pattern text-foreground flex flex-col">
      <Header />

      <div className="flex flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 gap-8">
        <Sidebar />

        <main className="flex-1 w-full min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Section */}
            <div className="mb-12 text-center sm:text-left py-8 sm:py-0">
              <h1 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white mb-4">
                DeFi Simulation <br className="hidden sm:block" />
                <span className="text-primary text-glow">& Operating System</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
                A sandbox environment to diagnose transaction failures, simulate on-chain interactions, and visualize DeFi protocols safely.
              </p>
              
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search error messages, protocols, or intentions..." 
                  className="pl-12 h-14 bg-secondary/50 border-primary/20 text-lg focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <MarketStats />

            {/* Queries Grid */}
            <h2 className="text-lg font-mono font-bold mb-6 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Available Scenarios
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-secondary/20 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredQueries?.map((query) => (
                  <Link key={query.id} href={`/query/${query.slug}`}>
                    <Card className="group h-full cursor-pointer hover:border-primary/50 transition-all duration-300 bg-secondary/10 border-border/50 backdrop-blur-sm overflow-hidden relative">
                      {/* Hover Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <CardHeader className="pb-3 relative">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-mono uppercase bg-primary/10 text-primary px-2 py-1 rounded border border-primary/20">
                            {query.pageType.replace('_', ' ')}
                          </span>
                          <Activity className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <CardTitle className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">
                          {query.intent}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative">
                        <CardDescription className="line-clamp-2 mb-4 font-mono text-xs">
                          "{query.rawQuery}"
                        </CardDescription>
                        <div className="flex items-center text-sm text-muted-foreground font-medium mt-auto group-hover:translate-x-1 transition-transform duration-200">
                          Launch Simulation <ArrowRight className="ml-2 h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
            
            {filteredQueries?.length === 0 && (
              <div className="text-center py-12 border border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">No scenarios found matching your search.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
