"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/admin/dashboard");
      } else {
        setError(data.message || "Authentication failed");
      }
    } catch (_err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000000]">
      <Card className="w-full max-w-md bg-[#000000] border-border rounded-sm">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold text-primary">
            System Access
          </CardTitle>
          <CardDescription className="text-sm">
            Restricted Administration Panel
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs font-mono text-muted-foreground uppercase tracking-wider"
              >
                Security Credential
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#000000] border-border text-primary font-mono text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="text-destructive text-sm font-mono">{error}</div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-mono font-bold py-3 px-4 uppercase tracking-widest text-sm transition-colors"
            >
              {loading ? "Authenticating..." : "Authenticate"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
