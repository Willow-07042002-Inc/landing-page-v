import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Minus, User } from "lucide-react";

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if modal has been shown in this session
    const hasSeenModal = sessionStorage.getItem('willow-welcome-modal-shown');
    if (!hasSeenModal) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Mark modal as shown in this session
    sessionStorage.setItem('willow-welcome-modal-shown', 'true');
  };

  const handleLawyerClick = () => {
    // Mark modal as shown in this session
    sessionStorage.setItem('willow-welcome-modal-shown', 'true');
    // Mark user as a lawyer - this persists across the session
    sessionStorage.setItem('willow-user-type', 'lawyer');
    setIsOpen(false);
    navigate("/for-lawyers");
  };

  const handleWillClick = () => {
    // Mark modal as shown in this session
    sessionStorage.setItem('willow-welcome-modal-shown', 'true');
    setIsOpen(false);
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-lg w-full relative"
          onClick={(e) => e.stopPropagation()}
          style={{ padding: '2.5rem 2rem 2rem' }}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Content */}
          <div className="flex flex-col items-center text-center">
            {/* Icon with Grey Line Running Through It */}
            <div className="relative flex items-center justify-center mb-6 w-full">
              {/* Grey Line - same width as buttons, same grey as buttons */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-full z-0">
                <div className="h-px bg-gray-200 w-full"></div>
              </div>
              {/* Alex Icon */}
              <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                <img 
                  src="/Alex Icon.jpg" 
                  alt="Alex" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Headline */}
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#222222] mb-8 leading-tight">
              What brings you to Willow?
            </h2>

            {/* Buttons - Stacked */}
            <div className="flex flex-col gap-3 w-full">
              {/* I'm a Lawyer Button */}
              <button
                onClick={handleLawyerClick}
                className="w-full px-6 py-3 rounded-lg bg-gray-200 hover:bg-[#138F8B] text-gray-700 hover:text-white font-medium text-base transition-colors duration-200"
              >
                I'm a Lawyer
              </button>

              {/* I Need a Will Button */}
              <button
                onClick={handleWillClick}
                className="w-full px-6 py-3 rounded-lg bg-gray-200 hover:bg-[#138F8B] text-gray-700 hover:text-white font-medium text-base transition-colors duration-200"
              >
                I Need a Will
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeModal;

