"use client"
import { FileText, Home, Search, Settings, Shield, Truck, Users, LogOut, User } from "lucide-react"
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
import { useGetEmployeeFromSession } from "@/lib/hooks/tanstack/query-hook/employee/useGetEmployeeFromSession"
import { handleLogOut } from "@/lib/actions/auth/log-out"

const employeeMenuItems = [
  {
    title: "Dashboard",
    url: "/employee/dashboard",
    icon: Home,
    badge: null,
  },
  {
    title: "Appointments",
    url: "/employee/appointments",
    icon: Search,
    badge: null,
  },
  {
    title: "Job Records",
    url: "/employee/job-records",
    icon: FileText,
    badge: "12",
  },
  {
    title: "Settings",
    url: "/employee/settings",
    icon: Settings,
    badge: null,
  },
]

const quickActions = [
  {
    title: "Active Jobs",
    icon: Truck,
    badge: "5",
  },
  {
    title: "Team Members",
    icon: Users,
    badge: null,
  },
]

export function EmployeeSidebar() {
  const pathname = usePathname()
  const {data : employee} = useGetEmployeeFromSession();

  

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Sidebar collapsible="icon" className="bg-[#242626] border-r border-emerald-700/30">
      <SidebarHeader className="border-b border-emerald-700/30 bg-[#242626] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-lg font-semibold text-white">TowPro</span>
            <span className="text-sm text-emerald-400">Employee Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#242626]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-400 font-medium">Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {employeeMenuItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`text-white hover:bg-emerald-600/20 hover:text-emerald-400 focus:bg-emerald-600/20 focus:text-emerald-400 active:bg-emerald-600/20 active:text-emerald-400 ${
                        isActive 
                          ? 'bg-emerald-600/30 text-emerald-400 border-l-2 border-emerald-500 focus:bg-emerald-600/30 active:bg-emerald-600/30' 
                          : ''
                      }`}
                    >
                      <Link href={item.url} className="flex items-center gap-3 focus:outline-none focus:ring-0 active:bg-transparent">
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

        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-400 font-medium">Quick Access</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="text-white hover:bg-emerald-600/20 hover:text-emerald-400"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-emerald-600 text-white hover:bg-emerald-700">{item.badge}</Badge>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-emerald-400 font-medium">Status</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-3 rounded-lg bg-emerald-600/10 border border-emerald-600/30 status-indicator group-data-[collapsible=icon]:hidden">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm text-emerald-400">On Duty</span>
              </div>
              <p className="text-xs text-white/70 mt-1">Ready for assignments</p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-emerald-700/30 p-4 bg-[#242626]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-3 w-full justify-start p-0 h-auto hover:bg-emerald-600/20 text-white group"
            >
              <Avatar className="h-8 w-8 border-2 border-emerald-500">
                <AvatarImage src={employee?.profileImage || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-emerald-600 text-white">
                  {employee?.name ? getInitials(employee.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium text-white max-w-[100px] truncate" title={employee?.name || "User"}>
                  {employee?.name || "User"}
                </span>
                <span className="text-xs text-emerald-400 max-w-[100px] truncate" title={employee?.email || "employee@company.com"}>
                  {employee?.email || "employee@company.com"}
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