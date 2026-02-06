import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAboutUsPage = location.pathname === "/about-us";

  const handleContactClick = () => {
    navigate("/contact");
    window.scrollTo(0, 0);
  };

  return (
    <footer 
      className={`py-8 ${isAboutUsPage ? 'text-[#222222]' : 'text-white'}`} 
      style={{ backgroundColor: isAboutUsPage ? '#F8FAFC' : '#138F8B' }}
    >
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-xs">
            <img 
              src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" 
              alt="Willow Logo" 
              className="h-12 md:h-16 mb-4"
              style={isAboutUsPage ? { 
                filter: 'brightness(0) saturate(100%) invert(27%) sepia(90%) saturate(1500%) hue-rotate(150deg) brightness(1) contrast(1)',
                WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(90%) saturate(1500%) hue-rotate(150deg) brightness(1) contrast(1)'
              } : {
                filter: 'brightness(0) invert(1)',
                WebkitFilter: 'brightness(0) invert(1)'
              }}
            />
            <p className={`text-xs ${isAboutUsPage ? 'text-[#222222]' : ''}`}>
              Copyright 2025 © All Rights Reserved, 07042002, Inc. "DBA" Willow
            </p>
            
          </div>
          
          <div className="max-w-xl text-xs">
            <p className={`mb-4 ${isAboutUsPage ? 'text-[#222222]' : ''}`}>
              This website is operated by 07042002 Inc. The information provided on this website and/or communicated through any
              company representative, including the Willow application and associated services, is for informational purposes only and
              should not be considered legal advice. 07042002 Inc. is not a law firm, and the use of our services and/or contact with any
              company representative does not create an attorney-client relationship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/terms" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                Terms of Service
              </Link>
              <Link to="/privacy" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                Privacy Policy
              </Link>
              <button 
                onClick={handleContactClick} 
                className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline bg-transparent border-none p-0 cursor-pointer" : "text-white hover:text-gray-300 underline bg-transparent border-none p-0 cursor-pointer"}
              >
                Contact Us
              </button>
              <Link to="/availability-map" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                Our Expansion Journey
              </Link>
              <Link to="/about-us" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                About Us
              </Link>
              <Link to="/book" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                Early Access
              </Link>
              <Link to="/request-access" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                Request Access
              </Link>
              <Link to="/pitol" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                Founding Firms
              </Link>
              <Link to="/clients" className={isAboutUsPage ? "text-[#222222] hover:text-gray-600 underline" : "text-white hover:text-gray-300 underline"}>
                Clients
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

