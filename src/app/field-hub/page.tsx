"use client";

import { CloudOff, RefreshCw, Signal, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatToE164 } from "@/lib/phone";

export default function FieldHub() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCachedData, setHasCachedData] = useState(false);
  const [offlineAlert, setOfflineAlert] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    national_id: "",
    phone: "",
    coop_code: "",
    acreage: "",
    primary_crop: "",
    revenue: "",
    id_inspected: false,
    visual_audit: false,
    consent_given: false,
  });

  useEffect(() => {
    // Check for cached audits on mount
    const cached = window.localStorage.getItem("kredo_cached_field_audits");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHasCachedData(true);
        }
      } catch (_e) {
        // ignore parsing errors
      }
    }
  }, []);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneBlur = () => {
    if (formData.phone) {
      handleChange("phone", formatToE164(formData.phone));
    }
  };

  const validateStep1 = () =>
    !!(formData.name && formData.national_id && formData.phone);
  const validateStep2 = () =>
    !!(
      formData.coop_code &&
      formData.acreage &&
      formData.primary_crop &&
      formData.revenue
    );
  const validateStep3 = () =>
    !!(
      formData.id_inspected &&
      formData.visual_audit &&
      formData.consent_given
    );

  const handleSubmit = async () => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;

    setIsLoading(true);
    setOfflineAlert(false);

    const payload = {
      ...formData,
      officer_name: "Wanjiku Njeri", // Presumed session officer
    };

    try {
      const res = await fetch("/api/field/verify-ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      if (data.success) {
        // Reset form on success
        setStep(1);
        setFormData({
          name: "",
          national_id: "",
          phone: "",
          coop_code: "",
          acreage: "",
          primary_crop: "",
          revenue: "",
          id_inspected: false,
          visual_audit: false,
          consent_given: false,
        });
        alert(`Success: ${data.message}`);
      }
    } catch (_error) {
      // Offline fallback caching
      const existing = window.localStorage.getItem("kredo_cached_field_audits");
      const audits = existing ? JSON.parse(existing) : [];
      audits.push(payload);
      window.localStorage.setItem(
        "kredo_cached_field_audits",
        JSON.stringify(audits),
      );

      setOfflineAlert(true);
      setHasCachedData(true);
      setStep(1);
      setFormData({
        name: "",
        national_id: "",
        phone: "",
        coop_code: "",
        acreage: "",
        primary_crop: "",
        revenue: "",
        id_inspected: false,
        visual_audit: false,
        consent_given: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    const existing = window.localStorage.getItem("kredo_cached_field_audits");
    if (!existing) return;

    const audits = JSON.parse(existing);
    if (!Array.isArray(audits) || audits.length === 0) return;

    setIsLoading(true);
    let allSynced = true;

    for (const audit of audits) {
      try {
        const res = await fetch("/api/field/verify-ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(audit),
        });
        if (!res.ok) allSynced = false;
      } catch (_err) {
        allSynced = false;
      }
    }

    if (allSynced) {
      window.localStorage.removeItem("kredo_cached_field_audits");
      setHasCachedData(false);
      alert("All cached audits synced successfully!");
    } else {
      alert("Some audits failed to sync. Check connection and try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary flex flex-col">
      {/* Top Status Bar */}
      <header className="bg-card border-b border-border p-3 sticky top-0 z-50 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <UserCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Wanjiku Njeri</div>
            <div className="text-xs text-muted-foreground">
              Kiambu Rural Credit Unit
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge
            variant="outline"
            className="text-[10px] bg-green-500/10 text-green-500 border-green-500/20 px-1.5 py-0"
          >
            <Signal className="w-3 h-3 mr-1 inline" /> ONLINE
          </Badge>
          <div className="text-[10px] font-mono text-muted-foreground">
            Node: Neo4j-Aura-04
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {hasCachedData && (
          <Alert
            className="mb-4 bg-secondary/10 border-secondary/20 text-secondary cursor-pointer"
            onClick={handleSync}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <AlertDescription className="flex items-center justify-between w-full">
              <span>Offline audits pending sync</span>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs border-secondary/50 hover:bg-secondary hover:text-secondary-foreground"
              >
                Sync Now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {offlineAlert && (
          <Alert
            variant="destructive"
            className="mb-4 bg-destructive/10 border-destructive/20 text-destructive"
          >
            <CloudOff className="w-4 h-4 mr-2" />
            <AlertDescription>
              Device Offline: Farm audit cached locally to device storage.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6 flex items-center justify-between px-2">
          <div
            className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"} transition-colors`}
          />
          <div className="w-2" />
          <div
            className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"} transition-colors`}
          />
          <div className="w-2" />
          <div
            className={`h-1 flex-1 rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"} transition-colors`}
          />
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm p-5 space-y-6">
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-lg font-bold text-primary mb-1">
                  Step 1: Core KYC Identity Validation
                </h2>
                <p className="text-xs text-muted-foreground">
                  Ensure details strictly match the physical National ID.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Farmer Legal Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="e.g. John Doe"
                    className="h-12 bg-background text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label>National ID Number</Label>
                  <Input
                    type="number"
                    value={formData.national_id}
                    onChange={(e) =>
                      handleChange("national_id", e.target.value)
                    }
                    placeholder="e.g. 12345678"
                    className="h-12 bg-background text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    onBlur={handlePhoneBlur}
                    placeholder="e.g. 0712345678"
                    className="h-12 bg-background text-base"
                  />
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!validateStep1()}
                className="w-full h-12 text-base font-semibold"
              >
                Continue to Assessment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-lg font-bold text-primary mb-1">
                  Step 2: Value Chain & Agricultural Footprint
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select the primary economic drivers for this farmer.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Cooperative Association</Label>
                  <select
                    value={formData.coop_code}
                    onChange={(e) => handleChange("coop_code", e.target.value)}
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select Cooperative...
                    </option>
                    <option value="GDF-01">Githunguri Dairy Cooperative</option>
                    <option value="LTG-02">Limuru Tea Growers</option>
                    <option value="MCC-04">Murang'a Coffee Coop</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Farm Acreage</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.acreage}
                    onChange={(e) => handleChange("acreage", e.target.value)}
                    placeholder="e.g. 2.5"
                    className="h-12 bg-background text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Crop/Activity</Label>
                  <select
                    value={formData.primary_crop}
                    onChange={(e) =>
                      handleChange("primary_crop", e.target.value)
                    }
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="" disabled>
                      Select Activity...
                    </option>
                    <option value="Dairy">Dairy</option>
                    <option value="Tea">Tea</option>
                    <option value="Coffee">Coffee</option>
                    <option value="Maize">Maize</option>
                    <option value="Horticulture">Horticulture</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Estimated Monthly Revenue (KES)</Label>
                  <Input
                    type="number"
                    value={formData.revenue}
                    onChange={(e) => handleChange("revenue", e.target.value)}
                    placeholder="e.g. 45000"
                    className="h-12 bg-background text-base"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 h-12 text-base"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!validateStep2()}
                  className="flex-1 h-12 text-base font-semibold"
                >
                  Final Verification
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4">
              <div>
                <h2 className="text-lg font-bold text-primary mb-1">
                  Step 3: Signed Physical Verification
                </h2>
                <p className="text-xs text-muted-foreground">
                  Mandatory legal accountability parameters under Kenya Data
                  Protection Act.
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.id_inspected}
                    onChange={(e) =>
                      handleChange("id_inspected", e.target.checked)
                    }
                    className="mt-1 w-5 h-5 accent-primary shrink-0"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    "I verify that I have physically inspected the original,
                    un-modified National ID Card of the borrower."
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.visual_audit}
                    onChange={(e) =>
                      handleChange("visual_audit", e.target.checked)
                    }
                    className="mt-1 w-5 h-5 accent-primary shrink-0"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    "I verify that I have conducted a visual audit of the farm
                    acreage, crop health, and production yields listed above."
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 border border-border rounded-lg bg-background cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consent_given}
                    onChange={(e) =>
                      handleChange("consent_given", e.target.checked)
                    }
                    className="mt-1 w-5 h-5 accent-primary shrink-0"
                  />
                  <span className="text-sm text-foreground leading-relaxed">
                    "I confirm that the farmer has verbally authorized a KREDO
                    credit evaluation request."
                  </span>
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="h-14 px-6 text-base"
                  disabled={isLoading}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep3() || isLoading}
                  className="flex-1 h-14 text-base font-bold tracking-tight shadow-xl"
                >
                  {isLoading
                    ? "PROCESSING..."
                    : "[ UPLOAD & MERGE TO GRAPH NETWORK ]"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
