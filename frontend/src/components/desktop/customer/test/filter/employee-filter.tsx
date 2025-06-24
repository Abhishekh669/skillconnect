"use client"

import { useState } from "react"
import { SlidersHorizontal, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useSidebar } from "@/components/ui/sidebar"
import { fetchEmployees } from "@/lib/data"
import DesktopFilters from "./desktop-filters"
import MobileFilters from "./mobile-fitlers"
import EmployeeCard from "./employee-card"
import Pagination from "./pagination"
import DesktopFilterBar from "./desktop-filter-bar"

interface FilterState {
  categories: string[]
  locations: string[]
  hourlyRate: [number, number]
  rating: [number]
  availability: string[]
  experience: string[]
}

interface PaginationState {
  currentPage: number
  totalPages: number
  totalResults: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function Component() {
  const [searchQuery, setSearchQuery] = useState("")
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    locations: [],
    hourlyRate: [0, 200],
    rating: [0],
    availability: [],
    experience: [],
  })

  const isMobile = useSidebar();


  const applyFilters = async (page = 1) => {
    setIsLoading(true)
    try {
      const filterParams = {
        search: searchQuery,
        categories: filters.categories,
        locations: filters.locations,
        hourlyRate: filters.hourlyRate,
        rating: filters.rating,
        availability: filters.availability,
        experience: filters.experience,
      }

      const result = await fetchEmployees(filterParams, page, 6)
      setEmployees(result.employees)
      setPagination(result.pagination)
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearFilters = () => {
    const defaultFilters = {
      categories: [],
      locations: [],
      hourlyRate: [0, 200] as [number, number],
      rating: [0] as [number],
      availability: [],
      experience: [],
    }
    setFilters(defaultFilters)
    setSearchQuery("")

    // Also apply the cleared filters immediately
    setTimeout(() => {
      applyFilters(1)
    }, 100)
  }

  const removeFilter = (filterType: string, filterValue: string) => {
    const newFilters = { ...filters }

    switch (filterType) {
      case "search":
        setSearchQuery("")
        break
      case "categories":
        newFilters.categories = filters.categories.filter((c) => c !== filterValue)
        break
      case "locations":
        newFilters.locations = filters.locations.filter((l) => l !== filterValue)
        break
      case "availability":
        newFilters.availability = filters.availability.filter((a) => a !== filterValue)
        break
      case "experience":
        newFilters.experience = filters.experience.filter((e) => e !== filterValue)
        break
      case "hourlyRate":
        newFilters.hourlyRate = [0, 200]
        break
      case "rating":
        newFilters.rating = [0]
        break
    }

    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    applyFilters(page)
  }

  // Initial load
  useState(() => {
    applyFilters(1)
  })

  return (
    <div className="min-h-screen bg-[#242626]">
      <div className="flex">
        {/* Desktop Filters Sidebar */}
        {!isMobile && <DesktopFilters filters={filters} onFiltersChange={setFilters} />}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-6 rounded-lg shadow-lg mb-6">
            <h1 className="text-3xl font-bold mb-2">Find Skilled Professionals</h1>
            <p className="opacity-90">Connect with top talent in your area</p>
          </div>

          {/* Desktop Filter Management Bar */}
          {!isMobile ? (
            <DesktopFilterBar
              filters={filters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onRemoveFilter={removeFilter}
              onClearAllFilters={clearFilters}
              onApplyFilters={() => applyFilters(1)}
              isLoading={isLoading}
              totalResults={pagination.totalResults}
            />
          ) : (
            /* Mobile Search and Filter */
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  placeholder="Search by name, skills, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && applyFilters(1)}
                  className="w-full pl-10 pr-4 py-2 bg-[#2F3131] border border-[#3A3C3C] text-[#E8E8E8] placeholder:text-[#B0B0B0] focus:border-[#25D366] focus:ring-[#25D366]/20 rounded-md"
                />
              </div>
              <MobileFilters
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={() => applyFilters(1)}
                onClearFilters={clearFilters}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-[#E8E8E8]">{isLoading ? "Searching..." : `Results`}</h2>
              {isLoading && <Loader2 className="h-5 w-5 animate-spin text-[#25D366]" />}
            </div>
            <Badge className="bg-[#25D366] text-white">
              Page {pagination.currentPage} of {pagination.totalPages}
            </Badge>
          </div>

          {/* Employee Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-[#2F3131] border border-[#3A3C3C] rounded-lg p-6 animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-[#3A3C3C] rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#3A3C3C] rounded w-3/4"></div>
                      <div className="h-3 bg-[#3A3C3C] rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="h-6 bg-[#3A3C3C] rounded w-20"></div>
                    <div className="h-3 bg-[#3A3C3C] rounded w-full"></div>
                    <div className="h-4 bg-[#3A3C3C] rounded w-2/3"></div>
                    <div className="h-8 bg-[#3A3C3C] rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : employees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employees.map((employee) => (
                <EmployeeCard key={employee._id} employee={employee} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-[#B0B0B0]">
                <SlidersHorizontal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2 text-[#E8E8E8]">No professionals found</h3>
                <p>Try adjusting your search criteria or clearing some filters</p>
              </div>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
