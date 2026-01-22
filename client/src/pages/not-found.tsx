import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold font-mono">404 Error</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground font-mono">
            The requested page path does not exist in the routing table.
          </p>
          <div className="mt-8">
            <Link href="/" className="text-primary hover:underline font-mono text-sm">
              &lt; Return to Index
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
