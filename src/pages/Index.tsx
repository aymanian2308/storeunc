import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import HeroCarousel from "../components/content/HeroCarousel";
import FeaturedCollections from "../components/content/FeaturedCollections";
import ProductShowcase from "../components/content/ProductShowcase";
import BrandStatement from "../components/content/BrandStatement";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroCarousel />
        <FeaturedCollections />
        <ProductShowcase />
        <BrandStatement />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;