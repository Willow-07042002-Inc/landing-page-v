import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-willow-700 py-8 text-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="max-w-xs">
            <img 
              src="/logo-bg-dark.png" 
              alt="Willow Logo" 
              className="h-8 mb-4"
            />
            <p className="text-xs">
              Copyright 2024 © All Rights Reserved, 07042002, Inc. "DBA" Willow
            </p>
            
          </div>
          
          <div className="max-w-xl text-xs">
            <p className="mb-4">
              This website is operated by 07042002 Inc. The information provided on this website and/or communicated through any
              company representative, including the Willow application and associated services, is for informational purposes only and
              should not be considered legal advice. 07042002 Inc. is not a law firm, and the use of our services and/or contact with any
              company representative does not create an attorney-client relationship.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/terms" className="text-white hover:text-gray-300 underline">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-white hover:text-gray-300 underline">
                Privacy Policy
              </Link>
              <button 
                onClick={handleContactClick} 
                className="text-white hover:text-gray-300 underline bg-transparent border-none p-0 cursor-pointer"
              >
                Contact Us
              </button>
              <Link to="/availability-map" className="text-white hover:text-gray-300 underline">
                Our Expansion Journey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

