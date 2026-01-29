import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

interface ProductCarouselProps {
  category?: string;
  limit?: number;
}

const ProductCarousel = ({ category, limit = 6 }: ProductCarouselProps) => {
  const { products, isLoading } = useProducts({ category, limit });

  if (isLoading) {
    return (
      <section className="w-full mb-16 px-6">
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4 space-y-3">
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
    return null;
  }

  return (
    <section className="w-full mb-16 px-6">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => {
            const primaryImage = product.image_urls?.[0] || product.image_url || "/placeholder.svg";
            const hoverImage = product.image_urls?.[1] || primaryImage;

            return (
              <CarouselItem
                key={product.id}
                className="basis-1/2 md:basis-1/3 lg:basis-1/4 pr-2 md:pr-4"
              >
                <Link to={`/product/${product.id}`}>
                  <Card className="border-none shadow-none bg-transparent group">
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
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default ProductCarousel;
