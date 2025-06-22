"use client"
import { Calendar, Car, FileText, Home, Settings, Wrench, LogOut, User } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { handleLogOut } from "@/lib/actions/auth/log-out"
import { useGetCustomerFromSession } from "@/lib/hooks/tanstack/query-hook/customer/useGetCustomerFromSession"
import { useMemo } from "react"
import { cn } from "@/lib/utils"

const customerMenuItems = [
  {
    title: "Dashboard",
    url: "/customer/dashboard",
    icon: Home,
    badge: null,
  },
  {
    title: "Search Employee",
    url: "/customer/search-employee",
    icon: Calendar,
    badge: "3",
  },
  {
    title: "Job Records",
    url: "/customer/job-records",
    icon: FileText,
    badge: null,
  },
  {
    title: "Settings",
    url: "/customer/settings",
    icon: Settings,
    badge: null,
  },
]

export function CustomerSidebar() {
  const pathname = usePathname()
  const {data : customer} = useGetCustomerFromSession()
  
  return (
    <Sidebar collapsible="icon" className="bg-[#242626] border-r border-emerald-700/30">
      <SidebarHeader className="border-b bg-[#242626] border-emerald-700/30 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-semibold text-white">TowPro</span>
            <span className="text-sm text-emerald-400">Customer Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#242626]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-400 font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {customerMenuItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn("text-white hover:bg-[#4f5050]/70 hover:text-white ",
                         isActive && "bg-[#4f5050] text-white border-l-1 border-emerald-500"
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-emerald-600 text-white hover:bg-emerald-700">{item.badge}</Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-emerald-400 font-medium">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Request Service"
                  className="text-white hover:bg-[#4f5050]/70 hover:text-white"
                >
                  <Wrench className="h-4 w-4" />
                  <span>Request Service</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-[#242626] border-emerald-700/30 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-3 w-full justify-start p-0 h-auto hover:bg-emerald-600/20 text-white group py-1 px-1"
            >
              <Avatar className="h-8 w-8 border-2 border-emerald-500">
                <AvatarImage src={customer?.image || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-emerald-600 text-white">
                  {customer?.username}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-white max-w-[100px] truncate" title={customer?.username || "Customer"}>
                  {customer?.username || "Customer"}
                </span>
                <span className="text-xs text-emerald-400 max-w-[100px] truncate" title={customer?.email || "customer@company.com"}>
                  {customer?.email || "customer@company.com"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-[#242626] border-emerald-700/30 text-white"
          >
            <DropdownMenuItem className="hover:bg-emerald-600/20 focus:bg-emerald-600/20">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-emerald-600/20 focus:bg-emerald-600/20">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>      
            <DropdownMenuSeparator className="bg-emerald-700/30" />
            <DropdownMenuItem 
              className="hover:bg-red-600/20 focus:bg-red-600/20 text-red-400"
              onClick={handleLogOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail className="hover:bg-emerald-600/10 transition-colors" />
    </Sidebar>
  )
}