import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-24 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-6">
              About Us
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're passionate about bringing you the best tech accessories, 
              combining quality, style, and innovation.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6 lg:px-12 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At TechCase, we believe that technology accessories should be as 
                  exceptional as the devices they protect. Our mission is to deliver 
                  premium quality products that enhance your tech experience.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every product in our collection is carefully selected to meet our 
                  high standards for quality, durability, and design.
                </p>
              </div>
              <div className="aspect-square bg-muted flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-6 lg:px-12">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-12 text-center">
              What We Stand For
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-lg font-medium text-foreground mb-3">Quality</h3>
                <p className="text-muted-foreground text-sm">
                  We never compromise on quality. Every product is tested to ensure it meets our standards.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">💡</div>
                <h3 className="text-lg font-medium text-foreground mb-3">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  We stay ahead of trends to bring you the latest and most innovative accessories.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-lg font-medium text-foreground mb-3">Service</h3>
                <p className="text-muted-foreground text-sm">
                  Your satisfaction is our priority. We're here to help with any questions or concerns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-6 lg:px-12 bg-muted/30">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground mb-6">
              Have questions? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="mailto:uncacademycode@gmail.com" 
                className="text-foreground hover:text-primary transition-colors"
              >
                uncacademycode@gmail.com
              </a>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <a 
                href="tel:0694784176" 
                className="text-foreground hover:text-primary transition-colors"
              >
                0694784176
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
