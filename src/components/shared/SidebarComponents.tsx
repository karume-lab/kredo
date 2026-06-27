"use client";

import {
  ChevronRight,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export const NavProjects = ({
  projects,
}: {
  projects: {
    name: string;
    url: Route | string;
    icon: React.ElementType;
  }[];
}) => {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Resources</SidebarGroupLabel>
      <SidebarMenu className="gap-2">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url as Route} target="_blank" rel="noreferrer">
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export const NavUser = ({
  user,
  showReturnToTasks = false,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  showReturnToTasks?: boolean;
}) => {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  return (
    <SidebarMenu className="gap-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-full">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={"/dashboard/profile" as Route}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                Personal Profile
              </Link>
            </DropdownMenuItem>
            {showReturnToTasks && (
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Return to Tasks
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

const isPathActive = (pathname: string, url: string) => {
  if (url === "/dashboard" || url === "/admin") {
    return pathname === url;
  }
  return pathname === url || pathname.startsWith(`${url}/`);
};

export const NavMain = ({
  items,
}: {
  items: {
    title: string;
    url: Route | string;
    icon?: React.ElementType;
    isActive?: boolean;
    items?: {
      title: string;
      url: Route | string;
    }[];
  }[];
}) => {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const allUrls = items.flatMap((item) => [
    item.url as string,
    ...(item.items?.map((subItem) => subItem.url as string) || []),
  ]);

  const getIsActive = (url: string) => {
    const isMatch = isPathActive(pathname, url);
    if (!isMatch) return false;

    const hasExactMatch = allUrls.some((u) => u === pathname);
    if (hasExactMatch) {
      return pathname === url;
    }

    const longerMatch = allUrls.find(
      (otherUrl) =>
        otherUrl !== url &&
        isPathActive(pathname, otherUrl) &&
        otherUrl.length > url.length,
    );

    return !longerMatch;
  };

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-2">
        {items.map((item) => {
          const isMatch = getIsActive(item.url as string);
          const isAnyChildActive = item.items?.some((subItem) =>
            getIsActive(subItem.url as string),
          );
          const isActive = isMatch || isAnyChildActive;

          if (!item.items) {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  size="lg"
                  className={cn(
                    "transition-all duration-300 py-7 px-5 rounded-2xl group",
                    isActive
                      ? "bg-primary/10 text-foreground font-black dark:bg-primary/20"
                      : "hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Link
                    href={item.url as Route}
                    className="flex items-center gap-4"
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-6 transition-transform duration-300 group-hover:scale-110",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-primary",
                        )}
                      />
                    )}
                    <span className="text-lg tracking-tight">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={cn(
                      isAnyChildActive &&
                        !isCollapsed &&
                        "text-foreground font-semibold",
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={getIsActive(subItem.url as string)}
                        >
                          <Link href={subItem.url as Route}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
