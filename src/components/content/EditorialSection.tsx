import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const EditorialSection = () => {
  return (
    <section className="w-full mb-16 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4 max-w-[630px]">
          <h2 className="text-2xl font-normal text-foreground leading-tight md:text-xl">
            Technology That Fits Your Lifestyle
          </h2>
          <p className="text-sm font-light text-foreground leading-relaxed">
            TechCase was founded by two tech enthusiasts who believed that mobile devices 
            deserve protection that's as premium as the phones themselves. We combine 
            cutting-edge materials with minimalist design to create cases and accessories 
            that complement your device, not overwhelm it.
          </p>
          <Link to="/about/our-story" className="inline-flex items-center gap-1 text-sm font-light text-foreground hover:text-foreground/80 transition-colors duration-200">
            <span>Read our full story</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="order-first md:order-last">
          <div className="w-full aspect-square overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80" 
              alt="TechCase founders with latest phone technology" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialSection;
