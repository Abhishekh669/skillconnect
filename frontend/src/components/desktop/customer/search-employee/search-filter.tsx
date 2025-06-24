"use client"
import type React from "react"
import { X, MapPin, Filter, ChevronDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { GetEmployeesOptions } from "@/lib/actions/user/customer/get/user.customer.get"

// Mock job categories - replace with your actual data
const jobCategories = [
  "Software Development",
  "Design",
  "Marketing",
  "Sales",
  "Customer Service",
  "Data Analysis",
  "Project Management",
  "Content Writing",
]

interface SearchFiltersProps {
  params: GetEmployeesOptions
  setParams: React.Dispatch<React.SetStateAction<GetEmployeesOptions>>
  onApply: () => void
  userAddress?: string
}

export function SearchFilters({ params, setParams, onApply, userAddress }: SearchFiltersProps) {
  const selectedFilters = [
    ...(params.search ? [{ type: "search", label: `Search: ${params.search}` }] : []),
    ...(params.minHourRate ? [{ type: "minRate", label: `Min $${params.minHourRate}/hr` }] : []),
    ...(params.maxHourRate && params.maxHourRate < 1000
      ? [{ type: "maxRate", label: `Max $${params.maxHourRate}/hr` }]
      : []),
    ...(params.minRating ? [{ type: "rating", label: `${params.minRating}+ Stars` }] : []),
    ...(params.address ? [{ type: "location", label: `Near ${params.address}` }] : []),
    ...(params.jobCategory ? [{ type: "category", label: params.jobCategory }] : []),
  ]

  const handleRemoveFilter = (filter: { type: string }) => {
    switch (filter.type) {
      case "search":
        setParams({ ...params, search: "" })
        break
      case "minRate":
        setParams({ ...params, minHourRate: 0 })
        break
      case "maxRate":
        setParams({ ...params, maxHourRate: 1000 })
        break
      case "rating":
        setParams({ ...params, minRating: 0 })
        break
      case "location":
        setParams({ ...params, address: "", radius: 10 })
        break
      case "category":
        setParams({ ...params, jobCategory: "" })
        break
    }
  }

  const handleClearAllFilters = () => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search: "",
      minHourRate: 0,
      maxHourRate: 1000,
      minRating: 0,
      jobCategory: "",
    }))
  }

  const handleNearMe = () => {
    if (userAddress) {
      setParams({
        ...params,
        address: userAddress,
      })
    }
  }

  return (
    <div className="bg-[#242626] border border-gray-700 rounded-xl h-full flex flex-col">
      <div className="p-6 flex items-center justify-between border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white">Filter Options</h3>
        <Button
          onClick={handleNearMe}
          className="bg-transparent hover:bg-[#21c063]/20 text-white border border-gray-600 hover:border-[#21c063]/50 hover:text-[#21c063] transition-all duration-200 text-xs px-3 py-1 h-auto"
          disabled={!userAddress}
          size="sm"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Near Me
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-y-6 p-6 overflow-y-auto custom-scrollbar">
        {selectedFilters.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#21c063]" />
                Active Filters
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAllFilters}
                className="text-xs text-gray-400 hover:text-white h-auto py-1 px-2"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#21c063]/20 text-[#21c063] hover:bg-[#21c063]/30 group cursor-pointer border border-[#21c063]/30 transition-all duration-200"
                  onClick={() => handleRemoveFilter(filter)}
                >
                  {filter.label}
                  <X className="h-3 w-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Accordion type="multiple" className="space-y-0" defaultValue={["search", "categories"]}>
          <div className="border-t border-gray-700" />
          <AccordionItem value="search" className="border-b border-gray-700">
            <AccordionTrigger className="hover:no-underline py-4 text-white hover:text-[#21c063] transition-colors text-sm font-medium">
              Search by keyword
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <Input
                value={params.search}
                onChange={(e) => setParams({ ...params, search: e.target.value })}
                placeholder="e.g. React Developer"
                className="bg-[#161717] border-gray-600 text-white placeholder:text-gray-400 focus:border-[#21c063] focus:ring-[#21c063]/20"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categories" className="border-b border-gray-700">
            <AccordionTrigger className="hover:no-underline py-4 text-white hover:text-[#21c063] transition-colors text-sm font-medium">
              Job Categories
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-3">
                {jobCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-3">
                    <Checkbox
                      id={category}
                      checked={params.jobCategory === category}
                      onCheckedChange={(checked) =>
                        setParams({
                          ...params,
                          jobCategory: checked ? category : "",
                        })
                      }
                      className="border-gray-500 data-[state=checked]:bg-[#21c063] data-[state=checked]:border-[#21c063]"
                    />
                    <Label
                      htmlFor={category}
                      className="text-sm cursor-pointer text-gray-300 hover:text-white transition-colors"
                    >
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rate" className="border-b border-gray-700">
            <AccordionTrigger className="hover:no-underline py-4 text-white hover:text-[#21c063] transition-colors text-sm font-medium">
              Hourly Rate
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-6 pt-2">
              <div className="space-y-3">
                <Label className="text-gray-300 flex justify-between text-xs">
                  <span>Min</span>
                  <span className="text-[#21c063] font-medium">${params.minHourRate || 0}</span>
                </Label>
                <Slider
                  value={[params.minHourRate || 0]}
                  onValueChange={([value]) => setParams({ ...params, minHourRate: value })}
                  max={1000}
                  min={0}
                  step={5}
                  className="[&>span:first-child]:h-1 [&>span>span]:bg-[#21c063] [&>span:first-child>span]:bg-[#21c063] [&>a]:bg-[#161717] [&>a]:border-2 [&>a]:border-[#21c063]"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-300 flex justify-between text-xs">
                  <span>Max</span>
                  <span className="text-[#21c063] font-medium">${params.maxHourRate || 1000}</span>
                </Label>
                <Slider
                  value={[params.maxHourRate || 1000]}
                  onValueChange={([value]) => setParams({ ...params, maxHourRate: value })}
                  max={1000}
                  min={0}
                  step={5}
                  className="[&>span:first-child]:h-1 [&>span>span]:bg-[#21c063] [&>span:first-child>span]:bg-[#21c063] [&>a]:bg-[#161717] [&>a]:border-2 [&>a]:border-[#21c063]"
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rating" className="border-b border-gray-700">
            <AccordionTrigger className="hover:no-underline py-4 text-white hover:text-[#21c063] transition-colors text-sm font-medium">
              Minimum Rating
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4 pt-2">
              <Slider
                value={[params.minRating || 0]}
                onValueChange={([value]) => setParams({ ...params, minRating: value })}
                max={5}
                min={0}
                step={0.1}
                className="[&>span:first-child]:h-1 [&>span>span]:bg-[#21c063] [&>span:first-child>span]:bg-[#21c063] [&>a]:bg-[#161717] [&>a]:border-2 [&>a]:border-[#21c063]"
              />
              <div className="text-sm text-center text-gray-300">
                <span className="text-[#21c063] font-medium">{(params.minRating || 0).toFixed(1)}</span> stars and
                above
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="location" className="border-b border-gray-700">
            <AccordionTrigger className="hover:no-underline py-4 text-white hover:text-[#21c063] transition-colors text-sm font-medium">
              Location
            </AccordionTrigger>
            <AccordionContent className="pb-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300 text-xs">Address</Label>
                <Input
                  value={params.address || ""}
                  onChange={(e) => setParams({ ...params, address: e.target.value })}
                  placeholder="Enter address..."
                  className="bg-[#161717] border-gray-600 text-white placeholder:text-gray-400 focus:border-[#21c063] focus:ring-[#21c063]/20"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-gray-300 flex justify-between text-xs">
                  <span>Radius</span>
                  <span className="text-[#21c063] font-medium">{params.radius || 10} km</span>
                </Label>
                <Slider
                  value={[params.radius || 10]}
                  onValueChange={([value]) => setParams({ ...params, radius: value })}
                  max={100}
                  min={1}
                  step={1}
                  className="[&>span:first-child]:h-1 [&>span>span]:bg-[#21c063] [&>span:first-child>span]:bg-[#21c063] [&>a]:bg-[#161717] [&>a]:border-2 [&>a]:border-[#21c063]"
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="p-6 border-t border-gray-700">
        <Button
          onClick={onApply}
          className="w-full bg-[#21c063] hover:bg-[#21c063]/90 text-white font-semibold"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
}
