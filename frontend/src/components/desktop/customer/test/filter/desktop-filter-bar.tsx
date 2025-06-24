"use client"

import { X, Filter, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface FilterState {
  categories: string[]
  locations: string[]
  hourlyRate: [number, number]
  rating: [number]
  availability: string[]
  experience: string[]
}

interface DesktopFilterBarProps {
  filters: FilterState
  searchQuery: string
  onSearchChange: (query: string) => void
  onRemoveFilter: (filterType: string, filterValue: string) => void
  onClearAllFilters: () => void
  onApplyFilters: () => void
  isLoading: boolean
  totalResults: number
}

export default function DesktopFilterBar({
  filters,
  searchQuery,
  onSearchChange,
  onRemoveFilter,
  onClearAllFilters,
  onApplyFilters,
  isLoading,
  totalResults,
}: DesktopFilterBarProps) {
  const getActiveFilters = () => {
    const active: Array<{ type: string; value: string; display: string; category: string }> = []

    if (searchQuery) {
      active.push({ type: "search", value: searchQuery, display: `"${searchQuery}"`, category: "Search" })
    }

    filters.categories.forEach((category) => {
      active.push({ type: "categories", value: category, display: category, category: "Category" })
    })

    filters.locations.forEach((location) => {
      active.push({ type: "locations", value: location, display: location, category: "Location" })
    })

    filters.availability.forEach((availability) => {
      active.push({ type: "availability", value: availability, display: availability, category: "Availability" })
    })

    filters.experience.forEach((experience) => {
      active.push({ type: "experience", value: experience, display: experience, category: "Experience" })
    })

    if (filters.hourlyRate[0] > 0 || filters.hourlyRate[1] < 200) {
      active.push({
        type: "hourlyRate",
        value: `${filters.hourlyRate[0]}-${filters.hourlyRate[1]}`,
        display: `$${filters.hourlyRate[0]} - $${filters.hourlyRate[1]}`,
        category: "Price",
      })
    }

    if (filters.rating[0] > 0) {
      active.push({
        type: "rating",
        value: filters.rating[0].toString(),
        display: `${filters.rating[0]}+ stars`,
        category: "Rating",
      })
    }

    return active
  }

  const activeFilters = getActiveFilters()

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Action Bar */}
      <Card className="bg-[#2F3131] border-[#3A3C3C] p-4">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#B0B0B0]" />
            <Input
              placeholder="Search professionals..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onApplyFilters()}
              className="pl-10 bg-[#242626] border-[#3A3C3C] text-[#E8E8E8] placeholder:text-[#B0B0B0] focus:border-[#25D366] focus:ring-[#25D366]/20"
            />
          </div>

          {/* Filter Count */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#25D366]" />
            <span className="text-[#E8E8E8] text-sm">
              {activeFilters.length} filter{activeFilters.length !== 1 ? "s" : ""} selected
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onApplyFilters}
              disabled={isLoading}
              className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6"
            >
              {isLoading ? "Applying..." : "Apply Filters"}
            </Button>
            {activeFilters.length > 0 && (
              <Button
                variant="outline"
                onClick={onClearAllFilters}
                className="border-[#3A3C3C] text-[#B0B0B0] hover:bg-[#3A3C3C] hover:text-[#E8E8E8]"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <Card className="bg-[#2F3131] border-[#3A3C3C] p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[#E8E8E8] font-medium flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#25D366]" />
                Active Filters ({activeFilters.length})
              </h3>
              <span className="text-[#B0B0B0] text-sm">{totalResults} results</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <div key={index} className="group relative">
                  <Badge
                    variant="secondary"
                    className="bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white transition-all duration-200 cursor-pointer pr-8 py-1.5 text-xs"
                  >
                    <span className="text-[#B0B0B0] group-hover:text-white/70 mr-1 text-xs">{filter.category}:</span>
                    <span className="font-medium">{filter.display}</span>
                  </Badge>
                  <button
                    onClick={() => onRemoveFilter(filter.type, filter.value)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white rounded-full p-0.5 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
