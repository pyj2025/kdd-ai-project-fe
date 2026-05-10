"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "New Reflection", href: "/dashboard/reflection" },
];

export default function AppSidebar() {
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
              {navItems.map(item => {
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

      <SidebarFooter className="px-3 pb-8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-[#6b7280] text-xs">
              <Link href="/help">
                <HelpCircle className="w-4 h-4" />
                Help Center
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-[#6b7280] text-xs">
              <Link href="/settings">
                <User className="w-4 h-4" />
                Account
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
