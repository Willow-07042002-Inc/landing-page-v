import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Circle } from "lucide-react";

const WillowPricing = () => {
  return <section id="pricing" className="py-16 md:py-24 bg-background">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-light mb-6">
            Let's Make This Easy
          </h2>
        </div>
        
        <div className="text-center mb-10">
          <a href = "https://willow-test-deploy.vercel.app">
          <Button  size="lg" className="bg-willow hover:bg-willow-600 transition-colors border-0 text-white py-6 px-10 text-lg">
            GET STARTED TODAY
          </Button>
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Willow Insurance Card */}
          <Card className="bg-gray-50 border-border shadow-sm p-8 flex flex-col items-center">
            <div className="flex justify-center mb-4">
              <img src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" alt="Willow Logo" className="h-16" />
            </div>
            
            <p className="text-muted-foreground mb-2 text-sm">MONTHLY</p>
            <p className="text-6xl font-heading mb-8">$1.98</p>
            
            <div className="w-full space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-willow fill-willow" />
                  <Check className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left">
                  <strong className="font-sans">Create</strong> your will online
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-willow fill-willow" />
                  <Check className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left">
                  <strong className="font-sans">Sign</strong> your will digitally
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-willow fill-willow" />
                  <Check className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left">
                  <strong className="font-sans">Share</strong> secure access with those you trust
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-willow fill-willow" />
                  <Check className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left">
                  Unlimited <strong className="font-sans">Updates</strong>, we'll even send suggestions
                </span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-willow fill-willow" />
                  <Check className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left">
                  Free access to selected <strong className="font-sans">Future</strong> features
                </span>
              </div>
            </div>
          </Card>
          
          {/* Anywhere Else Insurance Card */}
          <Card className="bg-gray-50 border-border shadow-sm p-8 flex flex-col items-center">
            <div className="flex justify-center mb-4 h-16 items-center">
              <h3 className="font-heading text-center text-2xl">Anywhere Else</h3>
            </div>
            
            <p className="text-muted-foreground mb-2 text-sm">FROM</p>
            <p className="text-6xl font-heading mb-8">$200</p>
            
            <div className="w-full space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-willow fill-willow" />
                  <Check className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left">Create your will online</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-gray-300 fill-gray-300" />
                  <X className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left text-muted-foreground">Sign your will digitally</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-gray-300 fill-gray-300" />
                  <X className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left text-muted-foreground">Share secure access with those you trust</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-gray-300 fill-gray-300" />
                  <X className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left text-muted-foreground">Unlimited Updates, we'll even send suggestions</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="relative h-6 w-6 mt-0.5 shrink-0">
                  <Circle className="h-6 w-6 stroke-gray-300 fill-gray-300" />
                  <X className="absolute top-0 left-0 h-6 w-6 text-white" />
                </div>
                <span className="text-left text-muted-foreground">Free access to selected future features</span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="text-center mt-10">
          <p className="text-gray-600 text-lg mt-6">
            <span className="font-medium">Already got a will?</span> Stay in the loop—sign up to be notified when you can upload and manage your existing documents.
          </p>
        </div>
      </div>
    </section>;
};

export default WillowPricing;
