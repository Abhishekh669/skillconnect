"use client"
import { Calendar, Car, FileText, Home, Settings, Wrench, LogOut, User, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"

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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-[#242626] border-b border-emerald-700/30 px-4 py-3">
      <div className="flex items-center justify-between w-full">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-emerald-600/20 p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-[#242626] border-emerald-700/30 text-white p-0">
              <SheetHeader className="p-6 pb-4 border-b border-emerald-700/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                    <Car className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <SheetTitle className="text-lg font-semibold text-white text-left">TowPro</SheetTitle>
                    <span className="text-sm text-emerald-400">Customer Portal</span>
                  </div>
                </div>
              </SheetHeader>
              
              <nav className="flex flex-col p-4 space-y-2">
                {customerMenuItems.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        "text-white hover:bg-[#4f5050]/70 hover:text-white",
                        isActive && "bg-[#4f5050] text-white border-l-4 border-emerald-500",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs px-2 py-1">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
                
                {/* Request Service Button in Mobile Menu */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 justify-start text-white hover:bg-[#4f5050]/70 hover:text-white px-4 py-3 text-sm h-auto"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Wrench className="h-5 w-5" />
                  <span>Request Service</span>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo and Brand - Centered on mobile */}
        <div className="flex items-center gap-2 md:gap-3 flex-1 md:flex-initial justify-center md:justify-start">
          <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-lg bg-emerald-600">
            <Car className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base md:text-lg font-semibold text-white">TowPro</span>
            <span className="text-xs md:text-sm text-emerald-400 hidden sm:block">Customer Portal</span>
          </div>
        </div>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center gap-0.5">
          {customerMenuItems.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap",
                  "text-white hover:bg-[#4f5050]/70 hover:text-white",
                  isActive && "bg-[#4f5050] text-white border-l-2 border-emerald-500",
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

          {/* Desktop Quick Action Button */}
          <Button
            variant="ghost"
            className="flex items-center gap-1.5 text-white hover:bg-[#4f5050]/70 hover:text-white ml-1 px-3 py-2 text-xs whitespace-nowrap"
          >
            <Wrench className="h-4 w-4" />
            <span>Request Service</span>
          </Button>
        </nav>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 md:gap-3 hover:bg-emerald-600/20 text-white p-1.5 md:p-2 rounded-lg"
            >
              <Avatar className="h-7 w-7 md:h-8 md:w-8 border-2 border-emerald-500">
                <AvatarImage src={customer?.image || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback className="bg-emerald-600 text-white text-xs md:text-sm">
                  {customer?.username?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex flex-col text-left">
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
            <div className="px-2 py-1.5 text-sm sm:hidden border-b border-emerald-700/30 mb-1">
              <div className="font-medium text-white truncate">
                {customer?.username || "Customer"}
              </div>
              <div className="text-xs text-emerald-400 truncate">
                {customer?.email || "customer@company.com"}
              </div>
            </div>
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