"use client";

import { Loader2, ShieldAlert, ShieldCheck, UserCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SiteLogo from "@/components/SiteLogo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Role = "loan_officer" | "sacco_admin" | "sys_admin";

const ROLE_PRESETS = {
  loan_officer: {
    username: "Wanjiku Njeri",
    branch: "Kiambu Rural Credit Unit",
  },
  sacco_admin: { username: "Gitau Njoroge", branch: "Head of Operations" },
  sys_admin: { username: "Daniel Karume", branch: "DevOps Engine" },
};

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [role, setRole] = useState<Role>("loan_officer");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { username, branch } = ROLE_PRESETS[role];
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, username, branch, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(data.redirectUrl);
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (_err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-center mb-8">
            <SiteLogo className="w-12 h-12 mb-4 rounded-xl shadow-lg" />
            <h1 className="text-2xl font-bold tracking-tight">KREDO</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Field-Agent Audited Integrity Networks
            </p>
          </div>

          <Tabs
            value={mode}
            onValueChange={(val) => setMode(val as "signin" | "signup")}
            className="w-full mb-8"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-muted-foreground">
                Select Active Session Role
              </Label>
              <RadioGroup
                value={role}
                onValueChange={(val) => setRole(val as Role)}
                className="grid grid-cols-1 gap-2"
              >
                <Label
                  htmlFor="loan_officer"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 hover:bg-accent`}
                >
                  <RadioGroupItem
                    value="loan_officer"
                    id="loan_officer"
                    className="sr-only"
                  />
                  <UserCircle2
                    className={`w-5 h-5 ${role === "loan_officer" ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <div>
                    <div className="text-sm font-medium">Loan Officer</div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_PRESETS.loan_officer.username} •{" "}
                      {ROLE_PRESETS.loan_officer.branch}
                    </div>
                  </div>
                </Label>

                <Label
                  htmlFor="sacco_admin"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors has-data-[state=checked]:border-secondary has-data-[state=checked]:bg-secondary/10 hover:bg-accent`}
                >
                  <RadioGroupItem
                    value="sacco_admin"
                    id="sacco_admin"
                    className="sr-only"
                  />
                  <ShieldCheck
                    className={`w-5 h-5 ${role === "sacco_admin" ? "text-secondary" : "text-muted-foreground"}`}
                  />
                  <div>
                    <div className="text-sm font-medium">SACCO Admin</div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_PRESETS.sacco_admin.username} •{" "}
                      {ROLE_PRESETS.sacco_admin.branch}
                    </div>
                  </div>
                </Label>

                <Label
                  htmlFor="sys_admin"
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors has-data-[state=checked]:border-destructive has-data-[state=checked]:bg-destructive/10 hover:bg-accent`}
                >
                  <RadioGroupItem
                    value="sys_admin"
                    id="sys_admin"
                    className="sr-only"
                  />
                  <ShieldAlert
                    className={`w-5 h-5 ${role === "sys_admin" ? "text-destructive" : "text-muted-foreground"}`}
                  />
                  <div>
                    <div className="text-sm font-medium">Platform DevOps</div>
                    <div className="text-xs text-muted-foreground">
                      {ROLE_PRESETS.sys_admin.username} •{" "}
                      {ROLE_PRESETS.sys_admin.branch}
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Platform Key</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password (admin123)"
                className="bg-background focus-visible:ring-primary h-11"
                required
              />
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="bg-destructive/10 border-destructive/20 text-destructive"
              >
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 font-medium text-base shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : mode === "signin" ? (
                "Authenticate Session"
              ) : (
                "Request Access"
              )}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        Secure Handshake &bull; KREDO Operations
      </div>
    </div>
  );
}
