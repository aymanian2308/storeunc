import { Card, CardContent } from "@/components/ui/card";
import { Link, useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "./Pagination";
import { useProducts } from "@/hooks/useProducts";

interface ProductGridProps {
  category?: string;
}

const ProductGrid = ({ category }: ProductGridProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const { products, totalPages, totalCount, isLoading } = useProducts({
    category,
    page: currentPage,
    pageSize: 12,
  });

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="w-full px-6 mb-16">
        <div className="text-center py-16">
          <p className="text-muted-foreground">No products found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full px-6 mb-16">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => {
          const primaryImage = product.image_urls?.[0] || product.image_url || "/placeholder.svg";
          const hoverImage = product.image_urls?.[1] || primaryImage;

          return (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="border-none shadow-none bg-transparent group cursor-pointer">
                <CardContent className="p-0">
                  <div className="aspect-square mb-3 overflow-hidden bg-muted/10 relative">
                    <img
                      src={primaryImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-0"
                    />
                    <img
                      src={hoverImage}
                      alt={`${product.name} alternate`}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300 opacity-0 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-black/[0.03]"></div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-light text-foreground">
                      {product.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium text-foreground">
                        {product.name}
                      </h3>
                      <p className="text-sm font-light text-foreground">
                        €{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </section>
  );
};

export default ProductGrid;
