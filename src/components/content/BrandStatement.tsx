import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BrandStatement = () => {
  return (
    <section className="py-32 px-6 lg:px-12 bg-card relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <p className="text-primary text-sm font-medium tracking-widest uppercase mb-6">
              Our Philosophy
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-foreground leading-tight mb-8">
              Technology that elevates your everyday
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              At TechCase, we believe your devices deserve protection as refined as 
              the technology within. We curate premium smartphones and accessories 
              that blend seamlessly into your lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/about/our-story"
                className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-medium tracking-wide hover:bg-primary-hover transition-all duration-300 group"
              >
                Our Story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/category/shop"
                className="inline-flex items-center justify-center gap-3 border border-border text-foreground px-8 py-4 text-sm font-medium tracking-wide hover:border-primary hover:text-primary transition-all duration-300"
              >
                Shop Collection
              </Link>
            </div>
          </div>
          
          {/* Image grid */}
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"
                  alt="Premium smartphone"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&q=80"
                  alt="Phone accessories"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="pt-8 space-y-4">
              <div className="aspect-square overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&q=80"
                  alt="Premium phone case"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&q=80"
                  alt="Leather phone case"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;