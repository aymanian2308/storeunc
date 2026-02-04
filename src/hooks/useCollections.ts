import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Collection {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  href: string;
  size: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useCollections = () => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as Collection[];
    },
  });
};
