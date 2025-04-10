import React, { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useEmblaCarousel from "embla-carousel-react";

const reviewsData = [
  {
    quote: "Why doesn't everyone use @Lemonade, Inc Insurance? I just switched and slashed my costs by $110 #Winning",
    author: "Valeria Delgado",
    username: "@valeriad90",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "Why doesn't everyone use @Lemonade, Inc Insurance? I just switched and slashed my costs by $110 #Winning",
    author: "Valeria Delgado",
    username: "@valeriad90",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "Why doesn't everyone use @Lemonade, Inc Insurance? I just switched and slashed my costs by $110 #Winning",
    author: "Valeria Delgado",
    username: "@valeriad90",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  },
  {
    quote: "Why doesn't everyone use @Lemonade, Inc Insurance? I just switched and slashed my costs by $110 #Winning",
    author: "Valeria Delgado",
    username: "@valeriad90",
    avatar: "/lovable-uploads/9ff0bcf3-4c32-4418-8d96-3727159fec7d.png"
  }
];

const ReviewCard = ({ quote, author, username, avatar }: { 
  quote: string; 
  author: string; 
  username: string;
  avatar: string;
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-border h-full">
    <div className="flex items-start space-x-3 mb-4">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={author} />
        <AvatarFallback>{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{author}</p>
        <p className="text-sm text-muted-foreground">{username}</p>
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
