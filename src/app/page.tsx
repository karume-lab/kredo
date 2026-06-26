import { ArrowRight, Network } from "lucide-react";
import Link from "next/link";
import SiteLogo from "@/components/SiteLogo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
              Decentralized Risk Infrastructure for{" "}
              <br className="hidden md:block" />
              <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Last-Mile Agricultural Lending.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 leading-relaxed">
              Map local economic footprints, query decentralized trust networks,
              and generate auditable narrative summaries for thin-file borrowers
              instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-background hover:bg-muted text-foreground border-border text-base h-12 px-8 transition-all"
              >
                Learn More
              </Button>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-base h-12 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Try the Prototype
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Worked Scenario Block */}
        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Real-World Resolution
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                See how our traversal logic handles thin-file borrowers locally.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Column */}
              <Card className="border-border shadow-none bg-background rounded-xl overflow-hidden">
                <div className="p-8">
                  <div className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive mb-6">
                    Borrower Constraint
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Thin-file youth borrower leasing 1 acre in Kiambu County
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Applying for KES 30,000 input credit. Zero CRB history.
                    Traditional models reject instantly due to lack of
                    formalized collateral.
                  </p>
                </div>
              </Card>

              {/* Right Column */}
              <Card className="border-border shadow-none bg-primary/5 rounded-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Network className="w-24 h-24 text-primary" />
                </div>
                <div className="p-8 relative z-10">
                  <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mb-6">
                    Kredo Traversal Logic
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Index-free adjacency lookup
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Queries delivery history at Githunguri Dairy, mapping 26
                    monthly milk deliveries as verifiable social collateral to
                    approve underwriting dynamically.
                  </p>
                </div>
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
            &copy; {new Date().getFullYear()}
            development.
          </p>
        </div>
      </footer>
    </div>
  );
}
