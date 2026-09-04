import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

/* Line-based field matching the site's input language — underline, teal on
   focus, no boxes. */
const lineField =
  "w-full bg-transparent border-0 border-b border-[#D4DAE0] px-0 py-2.5 text-base text-[#222222] placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-[#138F8B] transition-colors rounded-none";

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    // Reset form
    const form = e.target as HTMLFormElement;
    form.reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD]" style={{ color: "#222222" }}>
      <Navbar />
      <main className="flex-grow pt-32 md:pt-36 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-xl mx-auto">
            <div className="mb-4 text-center text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0C7370]">Contact</div>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-heading font-light text-center mb-4 text-[#222222]" style={{ lineHeight: 1.25 }}>
              We'd love to hear from you.
            </h1>
            <p className="mx-auto mb-12 max-w-md text-center text-[15px] md:text-base text-gray-500" style={{ lineHeight: 1.6 }}>
              Have questions about Willow? Send us a note and our team will get back to you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                  Name
                </label>
                <input id="name" name="name" placeholder="Your name" required className={lineField} />
              </div>

              <div>
                <label htmlFor="email" className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                  Email
                </label>
                <input id="email" name="email" type="email" placeholder="your.email@example.com" required className={lineField} />
              </div>

              <div>
                <label htmlFor="message" className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                  Message
                </label>
                <textarea id="message" name="message" rows={4} placeholder="How can we help you?" required className={`${lineField} resize-none`} />
              </div>

              <div className="pt-2 text-center">
                <Button type="submit" size="lg" className="willow-btn h-11 px-8 text-[15px] font-medium">
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
