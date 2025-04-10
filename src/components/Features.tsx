
import React from "react";
import { BarChart3, Lock, Zap, Code, LineChart, Settings } from "lucide-react";

const features = [
  {
    icon: <Zap className="h-8 w-8 text-blue-500" />,
    title: "Lightning Fast",
    description: "Our platform is optimized for speed, ensuring your applications load instantly."
  },
  {
    icon: <Lock className="h-8 w-8 text-blue-500" />,
    title: "Secure by Design",
    description: "Enterprise-grade security with end-to-end encryption and comprehensive authentication."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
    title: "Advanced Analytics",
    description: "Gain valuable insights with our powerful analytics and reporting tools."
  },
  {
    icon: <Code className="h-8 w-8 text-blue-500" />,
    title: "Developer Friendly",
    description: "Built with modern technologies and comprehensive documentation for easy integration."
  },
  {
    icon: <LineChart className="h-8 w-8 text-blue-500" />,
    title: "Scalable Architecture",
    description: "Our infrastructure grows with your needs, from startup to enterprise."
  },
  {
    icon: <Settings className="h-8 w-8 text-blue-500" />,
    title: "Customizable",
    description: "Tailor the platform to your specific requirements with extensive customization options."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-secondary/50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform comes packed with all the tools you need to build exceptional digital experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-background rounded-lg p-6 shadow-md border border-border hover:shadow-lg transition-shadow"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10 inline-block">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
