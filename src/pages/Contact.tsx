import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";

const Contact = () => {
  const { toast } = useToast();
  const [contactType, setContactType] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await supabase.from('form_submissions').insert({
        form_type: 'contact',
        contact_type: contactType || 'consumer',
        email: formData.get('email') as string,
        name: formData.get('name') as string,
        message: formData.get('message') as string,
      });
    } catch (err) {
      console.error("Failed to save submission:", err);
    }

    toast({
      title: "Message sent",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    form.reset();
    setContactType("");
  };

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
            }}>Contact Us</h1>
            
            <div className="text-center mb-8 text-muted-foreground" style={{
              color: '#222222'
            }}>
              We'd love to hear from you
            </div>
            
            <Separator className="my-8" />
            
            <div className="prose prose-slate max-w-none" style={{
              color: '#222222'
            }}>
              <p className="text-base leading-relaxed mb-6 text-center">
                Have questions about Willow? Fill out the form below and our team will get back to you as soon as possible.
              </p>
              
              <Card className="mt-8 border-border">
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contactType">I am a...</Label>
                      <select
                        id="contactType"
                        name="contactType"
                        value={contactType}
                        onChange={(e) => setContactType(e.target.value)}
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-willow focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option value="" disabled>Select one</option>
                        <option value="consumer">Individual / Family</option>
                        <option value="attorney">Estate Planning Attorney</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-willow focus-visible:border-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                        placeholder="How can we help you?" 
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-willow hover:bg-willow-600 text-white"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
