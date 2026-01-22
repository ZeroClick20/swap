import { useQueryDetail } from "@/hooks/use-queries";
import { useParams } from "wouter";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { InteractiveTool } from "@/components/InteractiveTool";
import { MarketStats } from "@/components/MarketStats";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowLeft, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function QueryPage() {
  const { slug } = useParams();
  const { data: query, isLoading, error } = useQueryDetail(slug || "");

  if (isLoading) {
    return <QueryPageSkeleton />;
  }

  if (error || !query) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex flex-1 container mx-auto px-4 py-8 items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-mono text-primary">404_QUERY_NOT_FOUND</h1>
            <p className="text-muted-foreground">The requested simulation scenario does not exist.</p>
            <Link href="/">
              <span className="text-primary hover:underline cursor-pointer flex items-center justify-center gap-2 mt-4">
                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-grid-pattern text-foreground flex flex-col">
      <Header />
      
      <div className="flex flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 gap-8">
        <Sidebar />
        
        <main className="flex-1 w-full min-w-0">
          {/* Breadcrumb / Back */}
          <Link href="/">
            <div className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 cursor-pointer transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header Section */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 uppercase tracking-wider font-mono">
                  {query.pageType.replace('_', ' ')}
                </Badge>
                <span className="text-xs font-mono text-muted-foreground">ID: {query.slug}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold font-mono tracking-tight text-white leading-tight">
                "{query.rawQuery}"
              </h1>
              
              <div className="flex items-start gap-4 bg-secondary/30 p-4 rounded-xl border-l-4 border-primary">
                <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-sm font-bold text-primary mb-1 uppercase font-mono">Problem Context</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {query.problemContext}
                  </p>
                </div>
              </div>
            </div>

            {/* Live Stats */}
            <MarketStats />

            {/* Interactive Simulation Tool */}
            <InteractiveTool 
              querySlug={query.slug} 
              recommendedActions={query.recommendedActions} 
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function QueryPageSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 container mx-auto px-4 pt-6 gap-8">
        <Sidebar />
        <main className="flex-1 space-y-8">
          <Skeleton className="h-6 w-32 bg-secondary" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4 bg-secondary" />
            <Skeleton className="h-24 w-full bg-secondary" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Skeleton className="h-24 bg-secondary" />
            <Skeleton className="h-24 bg-secondary" />
            <Skeleton className="h-24 bg-secondary" />
            <Skeleton className="h-24 bg-secondary" />
          </div>
          <Skeleton className="h-96 w-full bg-secondary" />
        </main>
      </div>
    </div>
  );
}
