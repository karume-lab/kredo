import Image from "next/image";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  size?: number;
}

export default function SiteLogo({ className, size = 32 }: SiteLogoProps) {
  return (
    <div
      className={cn("relative overflow-hidden shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <Image src="/logo.png" alt="KREDO Logo" fill className="object-contain" />
    </div>
  );
}
