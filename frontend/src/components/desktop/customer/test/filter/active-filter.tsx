"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface FilterState {
  categories: string[]
  locations: string[]
  hourlyRate: [number, number]
  rating: [number]
  availability: string[]
  experience: string[]
}

interface ActiveFiltersProps {
  filters: FilterState
  searchQuery: string
  onRemoveFilter: (filterType: string, filterValue: string) => void
  onClearAllFilters: () => void
}

export default function ActiveFilters({ filters, searchQuery, onRemoveFilter, onClearAllFilters }: ActiveFiltersProps) {
  const getActiveFilters = () => {
    const active: Array<{ type: string; value: string; display: string }> = []

    if (searchQuery) {
      active.push({ type: "search", value: searchQuery, display: `Search: "${searchQuery}"` })
    }

    filters.categories.forEach((category) => {
      active.push({ type: "categories", value: category, display: category })
    })

    filters.locations.forEach((location) => {
      active.push({ type: "locations", value: location, display: location })
    })

    filters.availability.forEach((availability) => {
      active.push({ type: "availability", value: availability, display: availability })
    })

    filters.experience.forEach((experience) => {
      active.push({ type: "experience", value: experience, display: experience })
    })

    if (filters.hourlyRate[0] > 0 || filters.hourlyRate[1] < 200) {
      active.push({
        type: "hourlyRate",
        value: `${filters.hourlyRate[0]}-${filters.hourlyRate[1]}`,
        display: `$${filters.hourlyRate[0]} - $${filters.hourlyRate[1]}`,
      })
    }

    if (filters.rating[0] > 0) {
      active.push({
        type: "rating",
        value: filters.rating[0].toString(),
        display: `${filters.rating[0]}+ stars`,
      })
    }

    return active
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className="bg-[#2F3131] border border-[#3A3C3C] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[#E8E8E8] font-medium">Selected Filters ({activeFilters.length})</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAllFilters}
          className="text-[#B0B0B0] hover:text-[#E8E8E8] hover:bg-[#242626] text-xs"
        >
          Clear All
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <div key={index} className="group relative">
            <Badge
              variant="secondary"
              className="bg-[#25D366]/20 text-[#25D366] border border-[#25D366] transition-all duration-200 cursor-pointer group-hover:bg-[#25D366] group-hover:text-white group-hover:pr-8"
            >
              <span className="text-xs">{filter.display}</span>
            </Badge>
            <button
              onClick={() => onRemoveFilter(filter.type, filter.value)}
              className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500 hover:text-white rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
