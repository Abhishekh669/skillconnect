"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Star, DollarSign, MapPin, Briefcase, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { jobCategories, locations } from "@/lib/data"

interface FilterState {
  categories: string[]
  locations: string[]
  hourlyRate: [number, number]
  rating: [number]
  availability: string[]
  experience: string[]
}

interface DesktopFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export default function DesktopFilters({ filters, onFiltersChange }: DesktopFiltersProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    location: true,
    price: true,
    rating: true,
    availability: true,
    experience: true,
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked ? [...filters.categories, category] : filters.categories.filter((c) => c !== category)
    onFiltersChange({ ...filters, categories: newCategories })
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked ? [...filters.locations, location] : filters.locations.filter((l) => l !== location)
    onFiltersChange({ ...filters, locations: newLocations })
  }

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, availability]
      : filters.availability.filter((a) => a !== availability)
    onFiltersChange({ ...filters, availability: newAvailability })
  }

  const handleExperienceChange = (experience: string, checked: boolean) => {
    const newExperience = checked
      ? [...filters.experience, experience]
      : filters.experience.filter((e) => e !== experience)
    onFiltersChange({ ...filters, experience: newExperience })
  }

  return (
    <div className="w-80 bg-[#2F3131] border-r border-[#3A3C3C] h-screen overflow-y-auto sticky top-0">
      <div className="p-6 border-b border-[#3A3C3C]">
        <h2 className="text-xl font-semibold text-[#E8E8E8]">Filter Options</h2>
        <p className="text-[#B0B0B0] text-sm mt-1">Select your preferences</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Job Categories */}
        <Card className="bg-[#242626] border-[#3A3C3C]">
          <Collapsible open={openSections.categories} onOpenChange={() => toggleSection("categories")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#2F3131] transition-colors">
                <CardTitle className="flex items-center justify-between text-[#E8E8E8] text-base">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#25D366]" />
                    Job Categories
                  </div>
                  {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {jobCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      className="border-[#3A3C3C] data-[state=checked]:bg-[#25D366] data-[state=checked]:border-[#25D366]"
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm text-[#B0B0B0] cursor-pointer hover:text-[#E8E8E8] transition-colors"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Location */}
        <Card className="bg-[#242626] border-[#3A3C3C]">
          <Collapsible open={openSections.location} onOpenChange={() => toggleSection("location")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#2F3131] transition-colors">
                <CardTitle className="flex items-center justify-between text-[#E8E8E8] text-base">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#25D366]" />
                    Location
                  </div>
                  {openSections.location ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3 max-h-48 overflow-y-auto">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.locations.includes(location)}
                      onCheckedChange={(checked) => handleLocationChange(location, checked as boolean)}
                      className="border-[#3A3C3C] data-[state=checked]:bg-[#25D366] data-[state=checked]:border-[#25D366]"
                    />
                    <label
                      htmlFor={`location-${location}`}
                      className="text-sm text-[#B0B0B0] cursor-pointer hover:text-[#E8E8E8] transition-colors"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Hourly Rate */}
        <Card className="bg-[#242626] border-[#3A3C3C]">
          <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#2F3131] transition-colors">
                <CardTitle className="flex items-center justify-between text-[#E8E8E8] text-base">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[#25D366]" />
                    Hourly Rate
                  </div>
                  {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="text-sm text-[#B0B0B0]">
                  ${filters.hourlyRate[0]} - ${filters.hourlyRate[1]}
                </div>
                <Slider
                  value={filters.hourlyRate}
                  onValueChange={(value) => onFiltersChange({ ...filters, hourlyRate: value as [number, number] })}
                  max={200}
                  min={0}
                  step={5}
                  className="w-full [&_[role=slider]]:bg-[#25D366] [&_[role=slider]]:border-[#25D366] [&_.bg-primary]:bg-[#25D366]"
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Rating */}
        <Card className="bg-[#242626] border-[#3A3C3C]">
          <Collapsible open={openSections.rating} onOpenChange={() => toggleSection("rating")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#2F3131] transition-colors">
                <CardTitle className="flex items-center justify-between text-[#E8E8E8] text-base">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#25D366]" />
                    Minimum Rating
                  </div>
                  {openSections.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div className="text-sm text-[#B0B0B0] flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {filters.rating[0]} stars & up
                </div>
                <Slider
                  value={filters.rating}
                  onValueChange={(value) => onFiltersChange({ ...filters, rating: value as [number] })}
                  max={5}
                  min={0}
                  step={0.1}
                  className="w-full [&_[role=slider]]:bg-[#25D366] [&_[role=slider]]:border-[#25D366] [&_.bg-primary]:bg-[#25D366]"
                />
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Availability */}
        <Card className="bg-[#242626] border-[#3A3C3C]">
          <Collapsible open={openSections.availability} onOpenChange={() => toggleSection("availability")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#2F3131] transition-colors">
                <CardTitle className="flex items-center justify-between text-[#E8E8E8] text-base">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#25D366]" />
                    Availability
                  </div>
                  {openSections.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {["Available", "Busy", "Away"].map((availability) => (
                  <div key={availability} className="flex items-center space-x-2">
                    <Checkbox
                      id={`availability-${availability}`}
                      checked={filters.availability.includes(availability)}
                      onCheckedChange={(checked) => handleAvailabilityChange(availability, checked as boolean)}
                      className="border-[#3A3C3C] data-[state=checked]:bg-[#25D366] data-[state=checked]:border-[#25D366]"
                    />
                    <label
                      htmlFor={`availability-${availability}`}
                      className="text-sm text-[#B0B0B0] cursor-pointer hover:text-[#E8E8E8] transition-colors"
                    >
                      {availability}
                    </label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Experience */}
        <Card className="bg-[#242626] border-[#3A3C3C]">
          <Collapsible open={openSections.experience} onOpenChange={() => toggleSection("experience")}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-[#2F3131] transition-colors">
                <CardTitle className="flex items-center justify-between text-[#E8E8E8] text-base">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#25D366]" />
                    Experience
                  </div>
                  {openSections.experience ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-3">
                {["0-1 years", "2-3 years", "3-5 years", "5+ years"].map((experience) => (
                  <div key={experience} className="flex items-center space-x-2">
                    <Checkbox
                      id={`experience-${experience}`}
                      checked={filters.experience.includes(experience)}
                      onCheckedChange={(checked) => handleExperienceChange(experience, checked as boolean)}
                      className="border-[#3A3C3C] data-[state=checked]:bg-[#25D366] data-[state=checked]:border-[#25D366]"
                    />
                    <label
                      htmlFor={`experience-${experience}`}
                      className="text-sm text-[#B0B0B0] cursor-pointer hover:text-[#E8E8E8] transition-colors"
                    >
                      {experience}
                    </label>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  )
}
