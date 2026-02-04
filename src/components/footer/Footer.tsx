import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border pt-16 pb-8 px-6 lg:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-light text-foreground tracking-tight mb-6">
              Tech<span className="text-primary">Case</span>
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium phones and accessories for the discerning tech enthusiast.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs font-medium text-foreground uppercase tracking-widest mb-6">Shop</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/category/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/phones" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                  Phones
                </Link>
              </li>
              <li>
                <Link to="/category/cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                  Cases
                </Link>
              </li>
              <li>
                <Link to="/category/accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/category/chargers" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                  Chargers
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-medium text-foreground uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/category/new-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium text-foreground uppercase tracking-widest mb-6">Contact</h4>
            <div className="space-y-4">
              <a 
                href="tel:0694784176" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>0694784176</span>
              </a>
              <a 
                href="mailto:uncacademycode@gmail.com" 
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span>uncacademycode@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © 2024 TechCase. All rights reserved.
            </p>
            <div className="flex gap-8">
              <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;