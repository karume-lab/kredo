import { ArrowRight, Database, Network, ShieldCheck } from "lucide-react";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <SiteLogo className="rounded-lg shadow-sm group-hover:scale-105 transition-transform" />
            <span className="text-xl font-bold text-foreground tracking-tight">
              KREDO
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all hover:shadow-md">
                Launch App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          {/* Decorative background gradients using semantic variables */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-200 h-200 bg-secondary/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-150 h-150 bg-primary/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen"></div>

          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Unlock the Power of <br className="hidden md:block" />
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Social Collateral.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 leading-relaxed">
              KREDO empowers agricultural SACCOs in Kenya with
              relationship-based credit risk analysis. Visualize trust networks
              and leverage AI to make confident lending decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base h-12 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Try the Prototype
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-background hover:bg-muted text-foreground border-border text-base h-12 px-8 transition-all"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Engineering Trust at Scale
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                We combine graph theory with modern language models to provide a
                holistic view of creditworthiness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 text-primary">
                    <Network className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">
                    Trust Graph Analysis
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Visualize relationships between farmers, coops, and
                    guarantors. Understand the strength of social ties
                    instantly.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2 */}
              <Card className="border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4 text-secondary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">
                    AI Confidence Briefs
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Powered by Featherless AI, we distill complex network
                    metrics into clear, 3-sentence lending recommendations.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card className="border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/50 rounded-xl flex items-center justify-center mb-4 text-accent-foreground">
                    <Database className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">Robust Architecture</CardTitle>
                  <CardDescription className="text-base mt-2">
                    Built on Neo4j for lightning-fast graph traversals,
                    seamlessly integrated with a modern Next.js edge
                    infrastructure.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card text-muted-foreground border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <SiteLogo size={24} className="rounded" />
            <span className="font-medium text-foreground">KREDO</span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} Karume Lab. Prototype under active
            development.
          </p>
        </div>
      </footer>
    </div>
  );
}
