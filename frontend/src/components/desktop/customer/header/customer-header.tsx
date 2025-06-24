"use client"
import { Calendar, Car, FileText, Home, Settings, Wrench, LogOut, User } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
import { handleLogOut } from "@/lib/actions/auth/log-out"
import { useGetCustomerFromSession } from "@/lib/hooks/tanstack/query-hook/customer/useGetCustomerFromSession"

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

export function CustomerHeader() {
  const pathname = usePathname()
  const { data: customer } = useGetCustomerFromSession()

  return (
    <header className="bg-[#242626] border-b border-emerald-700/30 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
            <Car className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-white">TowPro</span>
            <span className="text-sm text-emerald-400">Customer Portal</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex items-center gap-0.5">
          {customerMenuItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center text-white   gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap  hover:bg-[#4f5050]/70 hover:text-white",
                  isActive && "  text-[#21c063]",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge className="ml-1 bg-emerald-600 text-white hover:bg-emerald-700 text-[10px] px-1.5 py-0.5">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}

          {/* Quick Action Button */}
          <Button
            variant="ghost"
            className="flex items-center gap-1.5 text-white hover:bg-[#4f5050]/70 hover:text-white ml-1 px-3 py-2 text-xs whitespace-nowrap"
          >
            <Wrench className="h-4 w-4 text-[#21c063]" />
            <span className="text-[#21c063]">Request Service</span>
          </Button>
        </nav>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 hover:bg-emerald-600/20 text-white p-2 rounded-lg"
            >
              <Avatar className="h-8 w-8 border-2 border-emerald-500">
                <AvatarImage src={customer?.image || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-emerald-600 text-white">
                  {customer?.username?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span
                  className="text-sm font-medium text-white max-w-[120px] truncate"
                  title={customer?.username || "Customer"}
                >
                  {customer?.username || "Customer"}
                </span>
                <span
                  className="text-xs text-emerald-400 max-w-[120px] truncate"
                  title={customer?.email || "customer@company.com"}
                >
                  {customer?.email || "customer@company.com"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#242626] border-emerald-700/30 text-white">
            <DropdownMenuItem className="hover:bg-emerald-600/20 focus:bg-emerald-600/20">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-emerald-600/20 focus:bg-emerald-600/20">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-emerald-700/30" />
            <DropdownMenuItem className="hover:bg-red-600/20 focus:bg-red-600/20 text-red-400" onClick={handleLogOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
