import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/hooks/useProduct";

interface ProductInfoProps {
  product: Product | undefined;
  isLoading?: boolean;
}

const ProductInfo = ({ product, isLoading }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="hidden lg:block">
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="space-y-4 py-4 border-b border-border">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const categorySlug = product.category?.toLowerCase() || "all";

  return (
    <div className="space-y-6">
      {/* Breadcrumb - Show only on desktop */}
      <div className="hidden lg:block">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/category/${categorySlug}`}>{product.category}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product title and price */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-light text-muted-foreground mb-1">{product.category}</p>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">{product.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xl font-light text-foreground">€{product.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="space-y-4 py-4 border-b border-border">
        {product.material && (
          <div className="space-y-2">
            <h3 className="text-sm font-light text-foreground">Material</h3>
            <p className="text-sm font-light text-muted-foreground">{product.material}</p>
          </div>
        )}
        
        {!product.in_stock && (
          <div className="text-sm font-medium text-destructive">
            Out of Stock
          </div>
        )}
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-light text-foreground">Quantity</span>
          <div className="flex items-center border border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={decrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="h-10 flex items-center px-4 text-sm font-light min-w-12 justify-center border-l border-r border-border">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={incrementQuantity}
              className="h-10 w-10 p-0 hover:bg-transparent hover:opacity-50 rounded-none border-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
          disabled={!product.in_stock}
          onClick={() => {
            addItem(product, quantity);
            setQuantity(1);
            toast({
              title: "Added to bag",
              description: `${quantity} × ${product.name} added to your shopping bag.`,
            });
          }}
        >
          {product.in_stock ? "Add to Bag" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
