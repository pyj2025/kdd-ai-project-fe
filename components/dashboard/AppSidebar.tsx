"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard" },
  { label: "Reflections", href: "/dashboard/reflections" },
  { label: "New Reflection", href: "/dashboard/reflections/new" },
];

function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r border-[#e8eaed] bg-white top-14 h-[calc(100svh-56px)]">
      <SidebarHeader className="px-5 pt-8 pb-6">
        <p className="text-xs font-bold text-[#0d1f35] uppercase tracking-wide leading-none">
          Investor Portal
        </p>
        <p className="text-[10px] text-[#6b7280] mt-0.5">Honest Mirror v1.0</p>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={
                        isActive ? "text-[#0d1f35] font-semibold" : "text-[#6b7280] font-normal"
                      }
                    >
                      <Link href={item.href}>
                        <span
                          className={isActive ? "border-b-2 border-[#0d1f35] pb-0.5" : undefined}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
