import { ArrowRight, Database, Network, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold tracking-wider shadow-sm group-hover:scale-105 transition-transform">
              KR
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              KREDO
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:shadow-md">
                Launch App
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          {/* Decorative background gradients */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50"></div>
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -z-10 mix-blend-multiply"></div>

          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Prototype Available
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Unlock the Power of <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Social Collateral.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 leading-relaxed">
              KREDO empowers agricultural SACCOs in Kenya with
              relationship-based credit risk analysis. Visualize trust networks
              and leverage AI to make confident lending decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base h-12 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Try the Prototype
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border-slate-200 text-base h-12 px-8 transition-all"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Engineering Trust at Scale
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                We combine graph theory with modern language models to provide a
                holistic view of creditworthiness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <Card className="border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-slate-50/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
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
              <Card className="border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-slate-50/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
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
              <Card className="border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-slate-50/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600">
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
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-slate-300 font-bold text-xs tracking-wider">
              KR
            </div>
            <span className="font-medium text-slate-300">KREDO</span>
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
