"use client"

import { PanelLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export function EnhancedSidebarTrigger() {
  const { toggleSidebar, state } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className="h-8 w-8 text-white hover:bg-emerald-600/20 hover:text-emerald-400 transition-colors relative z-50"
      aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
    >
      <PanelLeft className="h-4 w-4" />
    </Button>
  )
}
