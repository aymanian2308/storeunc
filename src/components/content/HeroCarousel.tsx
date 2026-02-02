import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const slides = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    subtitle: "Titanium. So strong. So light.",
    description: "A17 Pro chip. The most powerful chip ever in a smartphone.",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200&q=80",
    cta: "Shop Now",
    href: "/category/phones",
  },
  {
    id: 2,
    title: "Premium Cases",
    subtitle: "Protection meets elegance",
    description: "Crafted with precision for the perfect fit and feel.",
    image: "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=1200&q=80",
    cta: "Explore Collection",
    href: "/category/cases",
  },
  {
    id: 3,
    title: "Power Essentials",
    subtitle: "Fast. Wireless. Portable.",
    description: "Never run out of power with our premium charging solutions.",
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&q=80",
    cta: "View Accessories",
    href: "/category/accessories",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden bg-background">
      {/* Background slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-all duration-500 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 absolute"
                }`}
              >
                {index === currentSlide && (
                  <>
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4 animate-fade-in">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-5xl md:text-7xl font-light text-foreground mb-6 leading-tight animate-fade-in-up">
                      {slide.title}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
                      {slide.description}
                    </p>
                    <Link
                      to={slide.href}
                      className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm font-medium tracking-wide hover:bg-primary-hover transition-all duration-300 group animate-fade-in"
                      style={{ animationDelay: '0.3s' }}
                    >
                      {slide.cta}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-12 right-12 z-30 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="w-12 h-12 border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
        <button
          onClick={nextSlide}
          className="w-12 h-12 border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-all duration-300 group"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-12 left-12 z-30 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 600);
              }
            }}
            className={`h-1 transition-all duration-500 ${
              index === currentSlide
                ? "w-12 bg-primary"
                : "w-6 bg-border hover:bg-muted-foreground"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-1/2 -translate-y-1/2 right-12 z-30 hidden lg:flex flex-col items-center gap-4">
        <span className="text-primary text-2xl font-light">
          {String(currentSlide + 1).padStart(2, "0")}
        </span>
        <div className="w-px h-16 bg-border" />
        <span className="text-muted-foreground text-sm">
          {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
};

export default HeroCarousel;