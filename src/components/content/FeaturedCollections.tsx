import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useCollections } from "@/hooks/useCollections";

const CollectionCard = ({ 
  title, 
  description, 
  image, 
  href, 
  size 
}: { 
  title: string; 
  description: string; 
  image: string; 
  href: string; 
  size: string;
}) => (
  <Link
    to={href}
    className={`group relative overflow-hidden ${
      size === "large" ? "md:col-span-2 aspect-[2/1]" : "aspect-square"
    }`}
  >
    {/* Image with zoom effect */}
    <div className="absolute inset-0 bg-card">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    </div>
    
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
    
    {/* Content */}
    <div className="absolute inset-0 p-8 flex flex-col justify-end">
      <div className="transform transition-transform duration-500 group-hover:translate-y-0">
        <h3 className="text-2xl md:text-3xl font-light text-foreground mb-2 flex items-center gap-3">
          {title}
          <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 text-primary" />
        </h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
    
    {/* Border highlight on hover */}
    <div className="absolute inset-0 border border-transparent group-hover:border-primary/30 transition-colors duration-500" />
  </Link>
);

const FeaturedCollections = () => {
  const { data: collections, isLoading } = useCollections();

  if (isLoading) {
    return (
      <section className="py-24 px-6 lg:px-12 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
            <div>
              <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
                Explore
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground">
                Featured Collections
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`bg-muted animate-pulse ${i === 1 || i === 4 ? 'md:col-span-2 aspect-[2/1]' : 'aspect-square'}`} 
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!collections || collections.length === 0) {
    return null;
  }

  return (
    <section className="py-24 px-6 lg:px-12 bg-background">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <div>
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4">
              Explore
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-foreground">
              Featured Collections
            </h2>
          </div>
          <Link
            to="/category/shop"
            className="mt-6 md:mt-0 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
          >
            View all products
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {collections.map((collection) => (
            <CollectionCard 
              key={collection.id} 
              title={collection.name}
              description={collection.description || ""}
              image={collection.image_url || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80"}
              href={collection.href}
              size={collection.size}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;