import type { Metadata } from "next";
import WhatsAppSimulator from "@/components/WhatsAppSimulator";

export const metadata: Metadata = {
  title: "WhatsApp Simulator",
  description: "WhatsApp Simulator",
};

export default function WhatsAppPage() {
  return (
    <main className="flex-1 w-full h-screen bg-[#efeae2] flex items-center justify-center p-0 md:p-6 lg:p-8">
      <div className="w-full h-full max-w-[1600px] shadow-sm rounded-none md:rounded-lg overflow-hidden bg-background">
        <WhatsAppSimulator />
      </div>
    </main>
  );
}
