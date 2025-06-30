import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useEmblaCarousel from "embla-carousel-react";

const reviewsData = [
  {
    quote: "Finally — someone who doesn't pretend this doesn't suck. Willow gets that I don't want to do it… and just does it for me.",
    author: "Sarah M.",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "I didn't want to deal with this at all, but Willow made it feel like something I could actually handle. Super grateful.",
    author: "Michael R.",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "It's like Willow read my mind. I'd been avoiding this forever — and it felt like they just said, 'No worries, we'll take care of it.'",
    author: "Emily K.",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "Feels like it was built by someone who actually gets how stressful this is. Simple, smart, and no guilt trip.",
    author: "David L.",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "I didn't even know where to start, but Willow made it feel like checking off a task — not a full-blown emotional project.",
    author: "Jessica T.",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "Cheaper than a coffee and actually useful? I'm sold.",
    author: "Alex P.",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  }
];

const ReviewCard = ({ quote, author,  avatar }: { 
  quote: string; 
  author: string; 
  avatar: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-border h-full">
    <div className="flex items-start space-x-3 mb-4">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#138F8B]">
        <span className="text-[#F3F4F6] font-medium">{author.charAt(0)}</span>
      </div>
      <div>
        <p className="font-medium">{author}</p>
      </div>
    </div>
    <p className="text-foreground">{quote}</p>
  </div>
);

const Reviews = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  useEffect(() => {
    if (emblaApi) {
      // Auto-scroll functionality
      const autoplayTimer = setInterval(() => {
        emblaApi.scrollNext();
      }, 3500); // Scroll every 3 seconds
      
      return () => {
        clearInterval(autoplayTimer);
      };
    }
  }, [emblaApi]);

  return (
    <section id="reviews" className="py-16 md:py-20 bg-gray-100">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Already Loved. And We're Just Getting Started!</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're here to do the thinking, so you can get back to living your life.
          </p>
        </div>
        
        <div className="w-full max-w-6xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviewsData.map((review, index) => (
                <div key={index} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3 pl-4 pr-4">
                  <ReviewCard {...review} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
