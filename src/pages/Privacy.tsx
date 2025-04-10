
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{
      color: '#222222'
    }}>
      <Navbar />
      <main className="flex-grow pt-36 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto py-[16px]">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4" style={{
              color: '#222222'
            }}>Privacy Policy</h1>
            
            <div className="text-center mb-8 text-muted-foreground" style={{
              color: '#222222'
            }}>
              Effective Date: April 1, 2025
            </div>
            
            <Separator className="my-8" />
            
            <div className="prose prose-slate max-w-none" style={{
              color: '#222222'
            }}>
              <p className="text-base leading-relaxed mb-6">
                Please note that this is a placeholder for your privacy policy content. You will need to provide the actual text for the privacy policy.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
