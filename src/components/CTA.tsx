
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const CTA = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send this to your API
    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
    if (input.value) {
      toast.success("Thank you for subscribing!");
      input.value = '';
    } else {
      toast.error("Please enter a valid email address");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-violet-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="mb-8 opacity-90 max-w-lg mx-auto">
              Join thousands of customers building amazing products with our platform. 
              Subscribe for updates and be the first to know about new features.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-white/20 border-white/40 text-white placeholder:text-white/70 focus-visible:border-white"
              />
              <Button type="submit" className="bg-white text-primary hover:bg-white/90" size="lg">
                Subscribe
              </Button>
            </form>
            
            <p className="mt-4 text-sm opacity-80">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
