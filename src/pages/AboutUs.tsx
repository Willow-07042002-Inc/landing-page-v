import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{
      color: '#222222'
    }}>
      <Navbar />
      
      {/* About Founder Section */}
      <section className="flex items-center" style={{ backgroundColor: '#138F8B', paddingTop: '80px', minHeight: '100vh' }}>
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
          <div className="flex flex-col gap-10 md:gap-16 lg:gap-20 items-start md:flex-row md:items-center">
            {/* Text Content */}
            <div className="w-full md:w-[55%] flex flex-col items-start gap-6 md:gap-8 pl-4 md:pl-8 lg:pl-12 text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight" style={{ lineHeight: '1.2' }}>
                Here's how we got started.
              </h2>
              <div className="flex flex-col gap-5 md:gap-6 text-base md:text-lg lg:text-xl leading-relaxed">
                <p>
                  I founded Willow based on a simple stat — 67% of Americans don't have a will.
                </p>
                <p>
                  Feel free to email me if you disagree, but I'm pretty sure the reason is simple: while important, we'd all rather think about literally anything else.
                </p>
                <p>
                  That's why I founded Willow — to make all of this easier.
                </p>
                <p>
                  We aren't here to replace lawyers — they do great work. We're here to make sure your plans never get lost, out of date, or misunderstood.
                </p>
                <p>
                  We make it so simple that sharing your will becomes the moment others finally get theirs done.
                </p>
              </div>
            </div>
            
            {/* Portrait */}
            <div className="w-full md:w-[45%] flex flex-col items-center">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#E8D5E3' }}>
                <img 
                  src="/Burlacoff Headshot.svg" 
                  alt="Aaron Burlacoff" 
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center 25%',
                    transform: 'scale(1.7)',
                    transformOrigin: 'center center'
                  }}
                />
              </div>
              <p className="text-white text-base md:text-lg lg:text-xl text-center">
                Aaron Burlacoff - Founder/CEO
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default AboutUs;

