import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    category: "Flagship",
    price: "€1,199",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
  },
  {
    id: 2,
    name: "Leather MagSafe Case",
    category: "Cases",
    price: "€59",
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&q=80",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    category: "Flagship",
    price: "€899",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80",
  },
  {
    id: 4,
    name: "MagSafe Charger Pro",
    category: "Accessories",
    price: "€49",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80",
  },
];

const ProductShowcase = () => {
  return (
    <section className="py-24 px-6 lg:px-12 bg-background">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
              New Arrivals
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-foreground">
              Latest Products
            </h2>
          </div>
          <Link
            to="/category/new-in"
            className="mt-6 md:mt-0 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
          >
            See all new arrivals
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        
        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group"
            >
              {/* Image */}
              <div className="aspect-[4/5] mb-6 overflow-hidden bg-card relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground border border-foreground px-6 py-3 bg-background/80 backdrop-blur-sm">
                    Quick View
                  </span>
                </div>
              </div>
              
              {/* Info */}
              <div className="space-y-1">
                <p className="text-xs text-primary tracking-wide uppercase">
                  {product.category}
                </p>
                <h3 className="text-foreground font-normal group-hover:text-primary transition-colors duration-300">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;