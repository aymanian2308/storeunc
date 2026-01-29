import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;

interface UseProductsOptions {
  category?: string;
  page?: number;
  pageSize?: number;
  limit?: number; // For carousels without pagination
}

interface UseProductsResult {
  products: Product[];
  totalCount: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
}

export const useProducts = ({
  category,
  page = 1,
  pageSize = 12,
  limit,
}: UseProductsOptions = {}): UseProductsResult => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["products", category, page, pageSize, limit],
    queryFn: async () => {
      // First get total count
      let countQuery = supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      if (category && category.toLowerCase() !== "all products") {
        countQuery = countQuery.ilike("category", category);
      }

      const { count } = await countQuery;
      const totalCount = count || 0;

      // Then fetch products with pagination or limit
      let query = supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (category && category.toLowerCase() !== "all products") {
        query = query.ilike("category", category);
      }

      if (limit) {
        // For carousels - just limit results
        query = query.limit(limit);
      } else {
        // For paginated grids
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);
      }

      const { data: products, error } = await query;

      if (error) throw error;

      return {
        products: products || [],
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    },
  });

  return {
    products: data?.products || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error: error as Error | null,
  };
};
