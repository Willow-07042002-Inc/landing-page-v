import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useEmblaCarousel from "embla-carousel-react";

const reviewsData = [
  {
    quote: "Creating my will with Willow was incredibly simple and stress-free. The process took just 10 minutes and I feel so much more secure knowing my family is protected.",
    author: "Sarah Johnson",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "I love how easy it is to update my will with Willow. When we bought our new home, I could make the changes in minutes. No need to start from scratch!",
    author: "Michael Chen",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "The family access feature is a game-changer. My children can securely access my will whenever they need to, and I don't have to worry about lost documents.",
    author: "Emily Rodriguez",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "As a busy parent, I appreciate how Willow handles all the legal complexities. I can focus on my family while knowing my will is properly managed.",
    author: "David Thompson",
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
      }, 3000); // Scroll every 3 seconds
      
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
        
        <div className="w-full max-w-5xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviewsData.map((review, index) => (
                <div key={index} className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3 pl-4">
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
