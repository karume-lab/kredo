"use client";

import {
  Database,
  FileText,
  LayoutDashboard,
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

const navMain = [
  {
    title: "Evaluation Terminal",
    url: "/dashboard",
    icon: Search,
    isActive: true,
  },
  {
    title: "Portfolio Analytics",
    url: "/dashboard/analytics",
    icon: LayoutDashboard,
  },
  {
    title: "Regulatory Reports",
    url: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Graph Database",
    url: "/dashboard/graph",
    icon: Database,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { state } = useSidebar();

  const user = {
    name: "Wanjiku Njeri",
    email: "wanjiku@kredo.africa",
    avatar: "",
  };

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
