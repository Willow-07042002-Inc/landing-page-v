import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Reviews from "@/components/Reviews";
import WillowPricing from "@/components/WillowPricing";
import ColoradoCallToAction from "@/components/ColoradoCallToAction";
import Footer from "@/components/Footer";
import Partners from "@/components/partners";
import WelcomeModal from "@/components/WelcomeModal";

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect lawyers to the For Lawyers page
  useEffect(() => {
    const isLawyer = sessionStorage.getItem('willow-user-type') === 'lawyer';
    if (isLawyer) {
      navigate('/for-lawyers', { replace: true });
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <WelcomeModal />
      <main className="flex-grow">
        <Hero />
        <Reviews />
        <FeaturesSection />
        {/*<Partners />*/}
        <WillowPricing />
        <ColoradoCallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
