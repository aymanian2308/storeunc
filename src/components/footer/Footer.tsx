import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-foreground text-background pt-12 pb-6 px-6 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-semibold tracking-tight mb-6">TechCase</h3>
            <p className="text-sm font-light text-background/70 leading-relaxed mb-6">
              Premium phones and cases for the modern tech enthusiast
            </p>
            
            <div className="space-y-3">
              <a 
                href="tel:0694784176" 
                className="flex items-center gap-3 text-sm text-background/80 hover:text-background transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>0694784176</span>
              </a>
              <a 
                href="mailto:uncacademycode@gmail.com" 
                className="flex items-center gap-3 text-sm text-background/80 hover:text-background transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>uncacademycode@gmail.com</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-background/80">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/category/shop" className="text-sm text-background/70 hover:text-background transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/phones" className="text-sm text-background/70 hover:text-background transition-colors">
                  Phones
                </Link>
              </li>
              <li>
                <Link to="/category/cases" className="text-sm text-background/70 hover:text-background transition-colors">
                  Cases
                </Link>
              </li>
              <li>
                <Link to="/category/accessories" className="text-sm text-background/70 hover:text-background transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link to="/category/chargers" className="text-sm text-background/70 hover:text-background transition-colors">
                  Chargers
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/category/new-in" className="text-sm text-background/70 hover:text-background transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/about/our-story" className="text-sm text-background/70 hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/about/customer-care" className="text-sm text-background/70 hover:text-background transition-colors">
                  Customer Care
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-background/60">
              © 2024 TechCase. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-xs text-background/60 hover:text-background transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="text-xs text-background/60 hover:text-background transition-colors">
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
