import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useHeroSlides } from "@/hooks/useHeroSlides";

const HeroCarousel = () => {
  const { data: slides, isLoading } = useHeroSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating || !slides?.length) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, slides]);

  useEffect(() => {
    if (!slides?.length) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, slides]);

  if (isLoading || !slides?.length) {
    return (
      <section className="h-[90vh] min-h-[700px] bg-[hsl(var(--secondary))] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative h-[90vh] min-h-[700px] overflow-hidden bg-foreground">
      {/* Full-bleed image slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-[1200ms] ease-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-[1.02]"
          }`}
        >
          <img
            src={slide.image_url || ""}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Centered content — Apple style */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute transition-all duration-700 ease-out flex flex-col items-center ${
              index === currentSlide
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6 pointer-events-none"
            }`}
          >
            {slide.subtitle && (
              <p className="text-white/70 text-sm md:text-base tracking-widest uppercase mb-4 font-light">
                {slide.subtitle}
              </p>
            )}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-semibold text-white mb-4 tracking-tight leading-none">
              {slide.title}
            </h1>
            {slide.description && (
              <p className="text-white/80 text-lg md:text-xl max-w-xl mb-8 font-light leading-relaxed">
                {slide.description}
              </p>
            )}
            {slide.cta_text && slide.cta_link && (
              <Link
                to={slide.cta_link}
                className="inline-flex items-center bg-white text-black px-8 py-3.5 text-sm font-medium tracking-wide hover:bg-white/90 transition-all duration-300 rounded-full"
              >
                {slide.cta_text}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Bottom indicators — minimal dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentSlide(index);
                  setTimeout(() => setIsAnimating(false), 800);
                }
              }}
              className={`rounded-full transition-all duration-500 ${
                index === currentSlide
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;
