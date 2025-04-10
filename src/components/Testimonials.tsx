
import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "This platform has transformed how we build products. The speed and reliability are unmatched in the industry.",
    author: "Sarah Johnson",
    role: "Product Lead, TechCorp",
    rating: 5
  },
  {
    quote: "We've cut our development time in half since switching to this platform. The analytics tools are invaluable for our team.",
    author: "Michael Chen",
    role: "CTO, GrowthStartup",
    rating: 5
  },
  {
    quote: "The security features and scalability of this platform give us peace of mind as we continue to expand our user base.",
    author: "Alex Rodriguez",
    role: "Security Engineer, SecureFinance",
    rating: 5
  }
];

const TestimonialCard = ({ quote, author, role, rating }: { quote: string; author: string; role: string; rating: number }) => (
  <div className="bg-background rounded-xl p-6 shadow-md border border-border">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      ))}
    </div>
    <p className="text-foreground italic mb-6">&ldquo;{quote}&rdquo;</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say about their experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
