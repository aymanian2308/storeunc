import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryWithImage {
  name: string;
  image: string | null;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      // Get distinct categories with a sample image from each
      const { data, error } = await supabase
        .from("products")
        .select("category, image_url, image_urls")
        .not("category", "is", null);

      if (error) throw error;

      // Group by category and get first image for each
      const categoryMap = new Map<string, CategoryWithImage>();
      
      data?.forEach((product) => {
        if (product.category && !categoryMap.has(product.category)) {
          const image = product.image_urls?.[0] || product.image_url || null;
          categoryMap.set(product.category, {
            name: product.category,
            image,
          });
        }
      });

      return Array.from(categoryMap.values());
    },
  });
};
