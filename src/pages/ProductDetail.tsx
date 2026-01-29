import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import ProductImageGallery from "../components/product/ProductImageGallery";
import ProductInfo from "../components/product/ProductInfo";
import ProductDescription from "../components/product/ProductDescription";
import ProductCarousel from "../components/content/ProductCarousel";
import { useProduct } from "@/hooks/useProduct";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";

const ProductDetail = () => {
  const { productId } = useParams();
  const { data: product, isLoading, error } = useProduct(productId);

  const productImages = product?.image_urls?.length 
    ? product.image_urls 
    : product?.image_url 
      ? [product.image_url] 
      : [];

  const categorySlug = product?.category?.toLowerCase() || "all";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-6">
        <section className="w-full px-6">
          {/* Breadcrumb - Show above image on smaller screens */}
          <div className="lg:hidden mb-6">
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
                    <Link to={`/category/${categorySlug}`}>{product?.category || "Products"}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{product?.name || "Loading..."}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          {error ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">Product not found</p>
              <Link to="/" className="text-sm underline mt-2 inline-block">
                Return to home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <ProductImageGallery 
                images={productImages} 
                productName={product?.name || "Product"} 
                isLoading={isLoading}
              />
              
              <div className="lg:pl-12 mt-8 lg:mt-0 lg:sticky lg:top-6 lg:h-fit">
                <ProductInfo product={product} isLoading={isLoading} />
                <ProductDescription product={product} isLoading={isLoading} />
              </div>
            </div>
          )}
        </section>
        
        {product && (
          <>
            <section className="w-full mt-16 lg:mt-24">
              <div className="mb-4 px-6">
                <h2 className="text-sm font-light text-foreground">You might also like</h2>
              </div>
              <ProductCarousel limit={6} />
            </section>
            
            <section className="w-full">
              <div className="mb-4 px-6">
                <h2 className="text-sm font-light text-foreground">Our other {product.category}</h2>
              </div>
              <ProductCarousel category={product.category || undefined} limit={6} />
            </section>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
