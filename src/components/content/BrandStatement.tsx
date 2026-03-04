import { Link } from "react-router-dom";

const BrandStatement = () => {
  return (
    <section className="py-32 md:py-40 px-6 lg:px-12 bg-foreground text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-tight">
            Technology that
            <br />
            elevates your everyday.
          </h2>
          <p className="text-primary-foreground/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto font-light">
            We curate premium smartphones and accessories that blend seamlessly
            into your lifestyle. Designed for those who demand more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/category/shop"
              className="inline-flex items-center justify-center bg-white text-black px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-300 rounded-full"
            >
              Shop Collection
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center border border-white/30 text-white px-8 py-3.5 text-sm font-medium tracking-wide hover:border-white/60 transition-all duration-300 rounded-full"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
