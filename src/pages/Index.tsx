import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import HeroCarousel from "../components/content/HeroCarousel";
import FeaturedCollections from "../components/content/FeaturedCollections";
import ProductShowcase from "../components/content/ProductShowcase";
import BrandStatement from "../components/content/BrandStatement";
import PromoBanner from "../components/content/PromoBanner";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroCarousel />
        <PromoBanner />
        <ProductShowcase />
        <FeaturedCollections />
        <BrandStatement />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
