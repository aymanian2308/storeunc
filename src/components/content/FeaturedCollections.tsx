import { Link } from "react-router-dom";
import { useCollections } from "@/hooks/useCollections";

const FeaturedCollections = () => {
  const { data: collections, isLoading } = useCollections();

  if (isLoading) {
    return (
      <section className="py-20 md:py-32 px-6 lg:px-12 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-muted animate-pulse mx-auto mb-4 rounded" />
            <div className="h-5 w-48 bg-muted animate-pulse mx-auto rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted animate-pulse rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!collections?.length) return null;

  return (
    <section className="py-20 md:py-32 px-6 lg:px-12 bg-secondary">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight mb-3">
            Explore the lineup.
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Find the perfect match for your style.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.slice(0, 3).map((collection) => (
            <Link
              key={collection.id}
              to={collection.href}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-card"
            >
              <img
                src={collection.image_url || "/placeholder.svg"}
                alt={collection.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-2xl font-semibold text-white mb-1">
                  {collection.name}
                </h3>
                {collection.description && (
                  <p className="text-white/70 text-sm font-light">
                    {collection.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        {collections.length > 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {collections.slice(3, 5).map((collection) => (
              <Link
                key={collection.id}
                to={collection.href}
                className="group relative aspect-[16/9] overflow-hidden rounded-2xl bg-card"
              >
                <img
                  src={collection.image_url || "/placeholder.svg"}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h3 className="text-2xl font-semibold text-white mb-1">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-white/70 text-sm font-light">
                      {collection.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollections;
