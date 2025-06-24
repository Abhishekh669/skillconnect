"use client"
import type { GetEmployeesOptions } from "@/lib/actions/user/customer/get/user.customer.get"
import { useCustomerStore } from "@/lib/store/customer/use-customer-store"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo, useCallback } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { useGetEmployees } from "@/lib/hooks/tanstack/query-hook/customer/useGetEmployees"
import { SearchFilters } from "./search-filter"
import EmployeeCard from "./EmployeeCard"

function SearchEmployeePage() {
  const searchParams = useSearchParams()
  const itemsPerPage = 10
  const { user } = useCustomerStore()

  const getParamsFromUrl = useCallback(() => {
    return {
      page: Number(searchParams.get("page") || "1"),
      limit: itemsPerPage,
      search: searchParams.get("search") || "",
      minHourRate: searchParams.get("minHourRate") ? Number(searchParams.get("minHourRate")) : 0,
      maxHourRate: searchParams.get("maxHourRate") ? Number(searchParams.get("maxHourRate")) : 1000,
      minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : 0,
      address: searchParams.get("address") || user?.location?.address || "",
      radius: searchParams.get("radius") ? Number(searchParams.get("radius")) : 10,
      jobCategory: searchParams.get("jobCategory") || "",
    }
  }, [searchParams, user?.location?.address])

  const [pendingParams, setPendingParams] = useState<GetEmployeesOptions>(getParamsFromUrl())
  const [appliedParams, setAppliedParams] = useState<GetEmployeesOptions>(getParamsFromUrl())

  const { data, isLoading: dataLoading, isError, isFetching } = useGetEmployees(appliedParams)

  const totalPages = data?.totalPages || 1
  const currentPage = appliedParams.page || 1
  const totalEmployees = data?.totalEmployees || 0
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  useEffect(() => {
    const newParams = getParamsFromUrl()
    setPendingParams(newParams)
    setAppliedParams(newParams)
  }, [getParamsFromUrl])

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || dataLoading || isFetching) return
    setAppliedParams((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleApplyFilters = () => {
    setAppliedParams({ ...pendingParams, page: 1, limit: itemsPerPage })
  }

  const getVisiblePages = () => {
    const visiblePages = []
    const windowSize = 2

    let startPage = Math.max(1, currentPage - windowSize)
    let endPage = Math.min(totalPages, currentPage + windowSize)

    if (currentPage <= windowSize + 1) {
      endPage = Math.min(2 * windowSize + 1, totalPages)
    }
    if (currentPage >= totalPages - windowSize) {
      startPage = Math.max(1, totalPages - 2 * windowSize)
    }

    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i)
    }

    return visiblePages
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-screen-2xl mx-auto h-full">
      <aside className="w-full md:w-80 lg:w-96">
        <div className="md:sticky top-6 h-full md:h-[calc(100vh-9.8rem)]">
          <SearchFilters
            params={pendingParams}
            setParams={setPendingParams}
            onApply={handleApplyFilters}
            userAddress={user?.location?.address}
          />
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="mb-8 relative rounded-xl p-6 md:p-8 overflow-hidden bg-[#242626] border border-gray-700">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-grid-white/5 bg-grid-black/5 [mask-image:linear-gradient(to_bottom,white_20%,transparent_80%)]"
          ></div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#21c063] bg-clip-text text-transparent">
            Find Qualified Employees
          </h1>
          <p className="text-base md:text-lg text-gray-300 mt-3 max-w-2xl">
            Browse through our network of skilled professionals
          </p>
        </div>

        <div className="mb-6 px-1">
          {dataLoading || isFetching ? (
            <Skeleton className="h-6 w-48 bg-[#242626]" />
          ) : (
            <p className="text-sm font-medium text-gray-300">
              Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalEmployees)}{" "}
              of {totalEmployees} employees
            </p>
          )}
        </div>

        <div className="flex-1 pb-6">
          {dataLoading || isFetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <Card key={i} className="h-[300px] bg-gray-800 border-gray-700">
                  <Skeleton className="h-full w-full bg-gray-700" />
                </Card>
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-400">Failed to load employees</p>
            </div>
          ) : data?.employees && data.employees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.employees.map((employee) => (
                <EmployeeCard key={employee._id} employee={employee} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-300">No employees found</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="sticky bottom-0 bg-[#161717]/80 backdrop-blur-sm py-4 border-t border-gray-700">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(currentPage - 1)
                    }}
                    aria-disabled={isFirstPage || dataLoading || isFetching}
                    className={`${isFirstPage || dataLoading || isFetching ? "pointer-events-none opacity-50" : ""} text-white hover:bg-gray-700 hover:text-[#21c063] border-gray-600`}
                  />
                </PaginationItem>

                {getVisiblePages().map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(page)
                      }}
                      isActive={page === currentPage}
                      className={`text-white hover:bg-gray-700 hover:text-[#21c063] border-gray-600 ${
                        page === currentPage ? "bg-[#21c063] text-white hover:bg-[#21c063] hover:text-white" : ""
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(currentPage + 1)
                    }}
                    aria-disabled={isLastPage || dataLoading || isFetching}
                    className={`${isLastPage || dataLoading || isFetching ? "pointer-events-none opacity-50" : ""} text-white hover:bg-gray-700 hover:text-[#21c063] border-gray-600`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </main>
    </div>
  )
}

export default SearchEmployeePage
