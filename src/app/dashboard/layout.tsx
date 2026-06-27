import { cookies } from "next/headers";
import { DashboardSidebar } from "@/components/sidebar/DashboardSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { verifySession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("kredo_admin_session")?.value;
  let role = "loan_officer";

  if (token) {
    const session = await verifySession(token);
    if (session?.role) {
      role = session.role;
    }
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar role={role} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] border-b border-border/50 px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 overflow-hidden">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
