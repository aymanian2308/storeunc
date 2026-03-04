import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const ProductShowcase = () => {
  const { data: products } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("in_stock", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  if (!products?.length) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);

  return (
    <section className="py-20 md:py-32 px-6 lg:px-12 bg-background">
      <div className="container mx-auto">
        {/* Section header — Apple style: centered, tight */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight mb-3">
            New Arrivals
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            The latest additions to our collection.
          </p>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group"
            >
              <div className="aspect-square mb-5 overflow-hidden bg-secondary rounded-2xl relative">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="space-y-1 text-center">
                {product.category && (
                  <p className="text-xs text-primary/60 tracking-wide uppercase font-medium">
                    {product.category}
                  </p>
                )}
                <h3 className="text-foreground font-medium group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/category/shop"
            className="inline-flex items-center text-primary text-sm font-medium hover:underline underline-offset-4"
          >
            Shop all products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
