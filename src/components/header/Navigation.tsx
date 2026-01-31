import { Search, Heart, User, ShoppingBag, X, Menu } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCategories } from "@/hooks/useCategories";
import ShoppingBagDrawer from "./ShoppingBag";

const Navigation = () => {
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { data: categories = [] } = useCategories();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShoppingBagOpen, setIsShoppingBagOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Preload dropdown images for faster display
  useEffect(() => {
    const imagesToPreload = categories
      .filter(cat => cat.image)
      .map(cat => cat.image as string)
      .slice(0, 4);
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [categories]);

  const popularSearches = [
    "iPhone 15 Pro",
    "Samsung Galaxy", 
    "Leather Cases",
    "MagSafe Charger"
  ];
  
  // Build dynamic nav items based on categories from database
  const shopCategories = useMemo(() => {
    return categories.map(cat => cat.name);
  }, [categories]);

  const navLinks = [
    { name: "Shop", href: "/category/shop" },
    { name: "New In", href: "/category/new-in" },
    { name: "About", href: "/about/our-story" },
  ];

  return (
    <>
      <nav className="bg-background border-b border-border">
        <div className="flex items-center justify-between h-16 px-6 max-w-7xl mx-auto">
          {/* Left - Mobile Menu + Desktop Nav */}
          <div className="flex items-center gap-8">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-1 text-foreground hover:text-foreground/70 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm font-medium text-foreground hover:text-foreground/70 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Center - Logo */}
          <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
            <span className="text-xl font-bold tracking-tight text-foreground">TechCase</span>
          </Link>

          {/* Right - Icons */}
          <div className="flex items-center gap-1">
            <button 
              className="p-2 text-foreground hover:text-foreground/70 transition-colors"
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link 
              to={user ? (isAdmin ? "/admin" : "/profile") : "/auth"}
              className="hidden sm:flex p-2 text-foreground hover:text-foreground/70 transition-colors"
              aria-label={user ? "Account" : "Sign in"}
            >
              <User className="w-5 h-5" />
            </Link>
            
            <button 
              className="hidden sm:flex p-2 text-foreground hover:text-foreground/70 transition-colors"
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
            </button>
            
            <button 
              className="p-2 text-foreground hover:text-foreground/70 transition-colors relative"
              aria-label="Shopping bag"
              onClick={() => setIsShoppingBagOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-foreground text-background text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border z-50 animate-fade-in">
            <div className="max-w-2xl mx-auto px-6 py-8">
              <div className="relative mb-6">
                <div className="flex items-center gap-3 border-b border-foreground pb-3">
                  <Search className="w-5 h-5 text-foreground/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search phones, cases, accessories..."
                    className="flex-1 bg-transparent text-foreground placeholder:text-foreground/50 outline-none text-base"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="text-foreground/50 hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50 mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search) => (
                    <button
                      key={search}
                      className="text-sm text-foreground/70 hover:text-foreground py-1.5 px-3 border border-border rounded-full transition-colors hover:border-foreground"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background border-b border-border z-50 animate-fade-in">
            <div className="px-6 py-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block text-lg font-medium text-foreground hover:text-foreground/70 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {shopCategories.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs uppercase tracking-wider text-foreground/50 mb-3">Categories</p>
                  <div className="space-y-3">
                    {shopCategories.map((category) => (
                      <Link
                        key={category}
                        to={`/category/${category.toLowerCase()}`}
                        className="block text-sm text-foreground/70 hover:text-foreground transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 border-t border-border flex gap-4">
                <Link 
                  to={user ? (isAdmin ? "/admin" : "/profile") : "/auth"}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  {user ? "Account" : "Sign In"}
                </Link>
                <button className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground">
                  <Heart className="w-4 h-4" />
                  Favorites
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Shopping Bag Drawer */}
      <ShoppingBagDrawer 
        isOpen={isShoppingBagOpen}
        onClose={() => setIsShoppingBagOpen(false)}
        onViewFavorites={() => {}}
      />
    </>
  );
};

export default Navigation;
