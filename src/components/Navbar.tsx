import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const isCreateWillPage = location.pathname === "/create-will";
  const alwaysSmallPages = ["/availability-map", "/terms", "/privacy", "/contact"];
  const isAlwaysSmallPage = alwaysSmallPages.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-background/100 transition-all duration-300 ${scrolled || isAlwaysSmallPage ? 'py-4 border-b border-border' : 'py-6 md:py-12'}`}>
      <div className="container mx-auto px-4 flex items-center justify-center relative">
        <div className={`flex ${scrolled || isAlwaysSmallPage ? 'items-center' : 'items-end'} transition-all duration-300 ${isCreateWillPage ? 'absolute left-4 py-6' : ''}`}>
          <Link to="/" className="flex items-end">
            <img 
              src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
              alt="Willow Logo" 
              className={`transition-all duration-500 ${scrolled || isAlwaysSmallPage ? 'h-14 md:h-16' : 'h-16 md:h-20 mt-12 md:mt-8 lg:mt-8'}`} 
            />
          </Link>
        </div>
        
        {isCreateWillPage && (
          <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2">
            <div className="rounded-full border-4 border-background overflow-hidden w-24 h-24">
              <img 
                src="/lovable-uploads/705cc112-2e95-4f02-8977-fed85638cb3f.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
