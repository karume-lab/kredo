"use client";

import {
  Activity,
  Database,
  FileText,
  LayoutDashboard,
  MapPin,
  Search,
  Settings,
} from "lucide-react";
import SiteLogo from "@/components/SiteLogo";
import { NavMain, NavUser } from "@/components/shared/SidebarComponents";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const NAV_CONFIG = {
  loan_officer: [
    {
      title: "Evaluation Terminal",
      url: "/dashboard",
      icon: Search,
      isActive: true,
    },
    { title: "Field Verification", url: "/field-hub", icon: MapPin },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  sacco_admin: [
    {
      title: "Portfolio Analytics",
      url: "/dashboard/analytics",
      icon: LayoutDashboard,
      isActive: true,
    },
    { title: "Regulatory Reports", url: "/dashboard/reports", icon: FileText },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
  sys_admin: [
    {
      title: "System Diagnostics",
      url: "/admin/dashboard",
      icon: Activity,
      isActive: true,
    },
    { title: "Graph Database", url: "/dashboard/graph", icon: Database },
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
  ],
};

const USER_CONFIG = {
  loan_officer: {
    name: "Wanjiku Njeri",
    email: "wanjiku@kredo.co.ke",
    avatar: "",
  },
  sacco_admin: {
    name: "Gitau Njoroge",
    email: "gitau@kredo.co.ke",
    avatar: "",
  },
  sys_admin: { name: "Daniel Karume", email: "daniel@kredo.co.ke", avatar: "" },
};

export const DashboardSidebar = ({
  role = "loan_officer",
  ...props
}: React.ComponentProps<typeof Sidebar> & { role?: string }) => {
  const { state } = useSidebar();

  const user =
    USER_CONFIG[role as keyof typeof USER_CONFIG] || USER_CONFIG.loan_officer;
  const navMain =
    NAV_CONFIG[role as keyof typeof NAV_CONFIG] || NAV_CONFIG.loan_officer;

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b border-border/50">
        <div className="flex items-center gap-3 px-6 py-6 transition-all duration-200 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center h-20">
          <SiteLogo
            className={`w-auto object-contain shrink-0 transition-all duration-200 ${isCollapsed ? "h-10" : "h-12"}`}
          />
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-lg tracking-tight leading-none">
              KREDO
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">
              Financer Suite
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
