
import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import Reviews from "@/components/Reviews";
import WillowPricing from "@/components/WillowPricing";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Reviews />
        <FeaturesSection />
        <WillowPricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
