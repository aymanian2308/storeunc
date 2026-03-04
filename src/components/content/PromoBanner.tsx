import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const PromoBanner = () => {
  return (
    <section className="relative bg-foreground text-primary-foreground overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center">
        {/* Overline */}
        <p className="text-sm md:text-base tracking-[0.3em] uppercase text-primary-foreground/50 mb-6 font-light">
          Just arrived
        </p>

        {/* Hero title */}
        <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-semibold tracking-tight leading-[0.9] mb-6">
          Arcus Collection
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-primary-foreground/70 max-w-lg mb-10 font-light leading-relaxed">
          Sculptural forms. Timeless elegance. Designed to be noticed.
        </p>

        {/* CTA buttons — Apple style */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            to="/category/shop"
            className="inline-flex items-center gap-2 bg-primary-foreground text-foreground px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-primary-foreground/90 transition-all duration-300 rounded-full"
          >
            Shop Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground text-sm font-medium tracking-wide transition-all duration-300"
          >
            Learn more
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-foreground/[0.03] blur-3xl" />
      </div>
    </section>
  );
};

export default PromoBanner;
