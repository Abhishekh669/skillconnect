import { getEmployees, GetEmployeesOptions } from "@/lib/actions/user/customer/get/user.customer.get";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const fetchEmployeeFromQuery = async (query: GetEmployeesOptions) => {
  const response = await getEmployees(query);
  return response;
}

export const useGetEmployees = (query: GetEmployeesOptions) => {
  return useQuery({
    queryKey: ["get-employees-from-query", query],
    queryFn: () => fetchEmployeeFromQuery(query),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });
}