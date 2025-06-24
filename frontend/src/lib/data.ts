export const jobCategories = [
  "Technology",
  "Healthcare",
  "Education",
  "Construction",
  "Hospitality",
  "Transportation",
  "Cleaning",
  "Beauty & Wellness",
  "Home Services",
  "Other",
]

export const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
]

// Extended mock data for pagination
export const mockEmployees = [
  {
    _id: "1",
    name: "Sarah Johnson",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-74.006, 40.7128],
      address: "New York, NY",
    },
    jobCategory: "Technology",
    skills: "React, Node.js, TypeScript, MongoDB",
    hourlyRate: 75,
    rating: 4.8,
    completedJobs: 127,
    availability: "Available",
    experience: "5+ years",
  },
  {
    _id: "2",
    name: "Mike Chen",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-118.2437, 34.0522],
      address: "Los Angeles, CA",
    },
    jobCategory: "Healthcare",
    skills: "Patient Care, Medical Records, CPR Certified",
    hourlyRate: 65,
    rating: 4.9,
    completedJobs: 89,
    availability: "Busy",
    experience: "3-5 years",
  },
  {
    _id: "3",
    name: "Emily Rodriguez",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781],
      address: "Chicago, IL",
    },
    jobCategory: "Education",
    skills: "Mathematics, Tutoring, Curriculum Development",
    hourlyRate: 50,
    rating: 4.7,
    completedJobs: 156,
    availability: "Available",
    experience: "2-3 years",
  },
  {
    _id: "4",
    name: "David Wilson",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604],
      address: "Houston, TX",
    },
    jobCategory: "Construction",
    skills: "Carpentry, Electrical, Project Management",
    hourlyRate: 85,
    rating: 4.6,
    completedJobs: 203,
    availability: "Available",
    experience: "5+ years",
  },
  {
    _id: "5",
    name: "Lisa Thompson",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-122.4194, 37.7749],
      address: "San Francisco, CA",
    },
    jobCategory: "Beauty & Wellness",
    skills: "Hair Styling, Makeup, Skincare Consultation",
    hourlyRate: 60,
    rating: 4.9,
    completedJobs: 142,
    availability: "Available",
    experience: "3-5 years",
  },
  {
    _id: "6",
    name: "John Smith",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-122.4194, 37.7749],
      address: "San Francisco, CA",
    },
    jobCategory: "Technology",
    skills: "Python, Django, PostgreSQL, AWS",
    hourlyRate: 90,
    rating: 4.5,
    completedJobs: 78,
    availability: "Available",
    experience: "5+ years",
  },
  {
    _id: "7",
    name: "Maria Garcia",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-95.3698, 29.7604],
      address: "Houston, TX",
    },
    jobCategory: "Cleaning",
    skills: "Residential Cleaning, Commercial Cleaning, Eco-friendly Products",
    hourlyRate: 35,
    rating: 4.8,
    completedJobs: 234,
    availability: "Available",
    experience: "3-5 years",
  },
  {
    _id: "8",
    name: "Robert Brown",
    image: "/placeholder.svg?height=100&width=100",
    location: {
      type: "Point",
      coordinates: [-87.6298, 41.8781],
      address: "Chicago, IL",
    },
    jobCategory: "Transportation",
    skills: "Commercial Driving, Logistics, GPS Navigation",
    hourlyRate: 45,
    rating: 4.3,
    completedJobs: 167,
    availability: "Busy",
    experience: "5+ years",
  },
]

// Mock API function
export const fetchEmployees = async (filters: any, page = 1, limit = 6) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  let filtered = [...mockEmployees]

  // Apply filters
  if (filters.search) {
    filtered = filtered.filter(
      (employee) =>
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.skills.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.jobCategory.toLowerCase().includes(filters.search.toLowerCase()),
    )
  }

  if (filters.categories?.length > 0) {
    filtered = filtered.filter((employee) => filters.categories.includes(employee.jobCategory))
  }

  if (filters.locations?.length > 0) {
    filtered = filtered.filter((employee) => filters.locations.includes(employee.location.address))
  }

  if (filters.hourlyRate) {
    filtered = filtered.filter(
      (employee) => employee.hourlyRate >= filters.hourlyRate[0] && employee.hourlyRate <= filters.hourlyRate[1],
    )
  }

  if (filters.rating) {
    filtered = filtered.filter((employee) => employee.rating >= filters.rating[0])
  }

  if (filters.availability?.length > 0) {
    filtered = filtered.filter((employee) => filters.availability.includes(employee.availability))
  }

  if (filters.experience?.length > 0) {
    filtered = filtered.filter((employee) => filters.experience.includes(employee.experience))
  }

  // Pagination
  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedResults = filtered.slice(startIndex, endIndex)

  return {
    employees: paginatedResults,
    pagination: {
      currentPage: page,
      totalPages,
      totalResults: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}
