"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  CloudOff,
  Leaf,
  MapPin,
  Plus,
  RefreshCw,
  ShieldCheck,
  Signal,
  Trash2,
  UserCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    assets: [
      {
        id: "initial-asset",
        coop_code: "",
        acreage: "",
        primary_crop: "",
        revenue: "",
      },
    ],
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
  const validateStep2 = () => {
    if (!formData.assets || formData.assets.length === 0) return false;
    return formData.assets.every(
      (a) => a.coop_code && a.acreage && a.primary_crop && a.revenue,
    );
  };
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
          assets: [
            {
              id: crypto.randomUUID(),
              coop_code: "",
              acreage: "",
              primary_crop: "",
              revenue: "",
            },
          ],
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
        assets: [
          {
            id: crypto.randomUUID(),
            coop_code: "",
            acreage: "",
            primary_crop: "",
            revenue: "",
          },
        ],
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

  const formVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background/95 to-muted/20 text-foreground font-sans selection:bg-primary/20 selection:text-primary flex flex-col">
      {/* Dynamic Status Bar - Glassmorphism */}
      <header className="sticky top-0 z-50 px-4 py-3 bg-background/70 backdrop-blur-xl border-b border-white/5 shadow-sm">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-linear-to-br from-primary/30 to-primary/10 border border-primary/20 rounded-full flex items-center justify-center text-primary shadow-inner">
                <UserCircle className="w-6 h-6" />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse" />
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-foreground/90">
                Wanjiku Njeri
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Kiambu Rural
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-medium text-green-500">
              <Signal className="w-3 h-3" /> ONLINE
            </div>
            <div className="text-[10px] font-mono text-muted-foreground/70">
              Aura-04
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 max-w-xl mx-auto w-full flex flex-col overflow-x-hidden">
        {/* Offline Alerts */}
        <AnimatePresence>
          {hasCachedData && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert className="mb-6 bg-secondary/10 border-secondary/20 text-secondary-foreground shadow-lg backdrop-blur-md">
                <RefreshCw className="w-4 h-4 text-secondary animate-spin-slow" />
                <AlertDescription className="flex items-center justify-between w-full ml-2">
                  <span className="font-medium text-sm">
                    Offline audits pending sync
                  </span>
                  <Button
                    size="sm"
                    onClick={handleSync}
                    className="h-8 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-transform active:scale-95"
                  >
                    Sync Now
                  </Button>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {offlineAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Alert
                variant="destructive"
                className="mb-6 bg-destructive/10 border-destructive/20 text-destructive shadow-lg backdrop-blur-md"
              >
                <CloudOff className="w-4 h-4" />
                <AlertDescription className="ml-2 font-medium">
                  Device Offline: Audit cached to local storage.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Stepper Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Step {step} of 3
            </span>
            <span className="text-xs text-muted-foreground">
              {step === 1
                ? "Identity"
                : step === 2
                  ? "Footprint"
                  : "Verification"}
            </span>
          </div>
          <div className="flex gap-2 h-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-500 ease-out ${
                  step >= i
                    ? "bg-linear-to-r from-primary to-primary/80"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Cards with Motion */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0"
              >
                <div className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl ring-1 ring-black/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <UserCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Core KYC
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Verify physical National ID details.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2 group">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
                        Farmer Legal Name
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="John Doe"
                        className="h-14 bg-background/50 backdrop-blur-sm border-white/10 text-base transition-all hover:bg-background/80 focus:bg-background rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
                        National ID
                      </Label>
                      <Input
                        type="number"
                        value={formData.national_id}
                        onChange={(e) =>
                          handleChange("national_id", e.target.value)
                        }
                        placeholder="12345678"
                        className="h-14 bg-background/50 backdrop-blur-sm border-white/10 text-base transition-all hover:bg-background/80 focus:bg-background rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <Label className="text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        onBlur={handlePhoneBlur}
                        placeholder="0712345678"
                        className="h-14 bg-background/50 backdrop-blur-sm border-white/10 text-base transition-all hover:bg-background/80 focus:bg-background rounded-xl"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!validateStep1()}
                    className="w-full h-14 mt-8 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                  >
                    Continue <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0"
              >
                <div className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl ring-1 ring-black/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Agri-Footprint
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Economic drivers & value chain.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {formData.assets.map((asset, index) => (
                      <div
                        key={asset.id}
                        className="space-y-5 p-4 border border-white/10 rounded-2xl relative bg-background/20"
                      >
                        {formData.assets.length > 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8"
                            onClick={() => {
                              const newAssets = [...formData.assets];
                              newAssets.splice(index, 1);
                              setFormData({ ...formData, assets: newAssets });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                            Cooperative Association
                          </Label>
                          <Select
                            value={asset.coop_code}
                            onValueChange={(val) => {
                              const newAssets = [...formData.assets];
                              newAssets[index].coop_code = val;
                              setFormData({ ...formData, assets: newAssets });
                            }}
                          >
                            <SelectTrigger className="h-14">
                              <SelectValue placeholder="Select Cooperative..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GDF-01">
                                Githunguri Dairy Cooperative
                              </SelectItem>
                              <SelectItem value="LTG-02">
                                Limuru Tea Growers
                              </SelectItem>
                              <SelectItem value="MCC-04">
                                Murang'a Coffee Coop
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 group">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
                              Acreage
                            </Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={asset.acreage}
                              onChange={(e) => {
                                const newAssets = [...formData.assets];
                                newAssets[index].acreage = e.target.value;
                                setFormData({ ...formData, assets: newAssets });
                              }}
                              placeholder="2.5"
                              className="h-14 bg-background/50 backdrop-blur-sm border-white/10 text-base rounded-xl"
                            />
                          </div>
                          <div className="space-y-2 group">
                            <Label className="text-xs uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
                              Monthly (KES)
                            </Label>
                            <Input
                              type="number"
                              value={asset.revenue}
                              onChange={(e) => {
                                const newAssets = [...formData.assets];
                                newAssets[index].revenue = e.target.value;
                                setFormData({ ...formData, assets: newAssets });
                              }}
                              placeholder="45000"
                              className="h-14 bg-background/50 backdrop-blur-sm border-white/10 text-base rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                            Primary Crop
                          </Label>
                          <Select
                            value={asset.primary_crop}
                            onValueChange={(val) => {
                              const newAssets = [...formData.assets];
                              newAssets[index].primary_crop = val;
                              setFormData({ ...formData, assets: newAssets });
                            }}
                          >
                            <SelectTrigger className="h-14">
                              <SelectValue placeholder="Select Crop..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dairy">Dairy</SelectItem>
                              <SelectItem value="Tea">Tea</SelectItem>
                              <SelectItem value="Coffee">Coffee</SelectItem>
                              <SelectItem value="Maize">Maize</SelectItem>
                              <SelectItem value="Horticulture">
                                Horticulture
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      className="w-full border-dashed border-2 border-white/20 hover:border-white/40 h-14 rounded-xl"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          assets: [
                            ...formData.assets,
                            {
                              id: crypto.randomUUID(),
                              coop_code: "",
                              acreage: "",
                              primary_crop: "",
                              revenue: "",
                            },
                          ],
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Another Asset
                    </Button>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="w-20 h-14 rounded-xl border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!validateStep2()}
                      className="flex-1 h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                    >
                      Continue <ChevronRight className="w-5 h-5 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute inset-0"
              >
                <div className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl ring-1 ring-black/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-foreground">
                        Verification Audit
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Mandatory sign-offs for compliance.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 border border-white/5 bg-background/30 hover:bg-background/50 transition-colors rounded-2xl group">
                      <Checkbox
                        id="id_inspected"
                        checked={formData.id_inspected}
                        onCheckedChange={(c) =>
                          handleChange("id_inspected", c as boolean)
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor="id_inspected"
                        className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors cursor-pointer"
                      >
                        "I verify that I have physically inspected the original,
                        un-modified National ID Card of the borrower."
                      </label>
                    </div>

                    <div className="flex items-start gap-4 p-4 border border-white/5 bg-background/30 hover:bg-background/50 transition-colors rounded-2xl group">
                      <Checkbox
                        id="visual_audit"
                        checked={formData.visual_audit}
                        onCheckedChange={(c) =>
                          handleChange("visual_audit", c as boolean)
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor="visual_audit"
                        className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors cursor-pointer"
                      >
                        "I verify that I have conducted a visual audit of the
                        farm acreage, crop health, and production yields listed
                        above."
                      </label>
                    </div>

                    <div className="flex items-start gap-4 p-4 border border-white/5 bg-background/30 hover:bg-background/50 transition-colors rounded-2xl group">
                      <Checkbox
                        id="consent_given"
                        checked={formData.consent_given}
                        onCheckedChange={(c) =>
                          handleChange("consent_given", c as boolean)
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor="consent_given"
                        className="text-sm text-foreground/80 leading-relaxed group-hover:text-foreground transition-colors cursor-pointer"
                      >
                        "I confirm that the farmer has verbally authorized a
                        KREDO credit evaluation request."
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="w-20 h-14 rounded-xl border-white/10 hover:bg-white/5 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!validateStep3() || isLoading}
                      className="flex-1 h-14 text-sm font-bold tracking-tight rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-[0.98] overflow-hidden relative"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                          PROCESSING...
                        </div>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> MERGE TO GRAPH
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
