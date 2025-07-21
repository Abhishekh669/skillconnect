import { fetchProducts } from "@/lib/actions/product/get/get-query";
import { queryOptions } from "@tanstack/react-query";

export default function GetUserQuery() {
  return queryOptions({
    queryKey: ["products"],
    queryFn: () => fetchProducts(),
  });
}
