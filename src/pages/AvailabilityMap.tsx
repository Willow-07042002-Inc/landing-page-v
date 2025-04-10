import React from "react";
import Navbar from "@/components/Navbar";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
type StateSchedule = {
  name: string;
  date: string;
  isLive: boolean;
};
const AvailabilityMap = () => {
  const stateSchedules: StateSchedule[] = [{
    name: "Colorado",
    date: "May 2025",
    isLive: false
  }, {
    name: "Arizona",
    date: "June 2025",
    isLive: false
  }, {
    name: "California",
    date: "January 2026",
    isLive: false
  }, {
    name: "New York",
    date: "February 2026",
    isLive: false
  }, {
    name: "Texas",
    date: "March 2026",
    isLive: false
  }, {
    name: "Florida",
    date: "April 2026",
    isLive: false
  }, {
    name: "Illinois",
    date: "May 2026",
    isLive: false
  }, {
    name: "Washington",
    date: "June 2026",
    isLive: false
  }, {
    name: "Massachusetts",
    date: "July 2026",
    isLive: false
  }, {
    name: "Pennsylvania",
    date: "August 2026",
    isLive: false
  }];
  return <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-start px-4 pt-20 pb-16 mt-6">
        <div className="container max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-6 mt-16">
            We're Almost Ready
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Willow is launching state-by-state across the United States. 
            See when we'll be available in your area.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {stateSchedules.map(state => <div key={state.name} className={`border rounded-lg p-4 flex items-center justify-between ${state.isLive ? "bg-willow/10 border-willow" : "bg-background border-border"}`}>
                <div className="flex items-center">
                  <MapPin className={`mr-3 ${state.isLive ? "text-willow" : "text-muted-foreground"}`} />
                  <span className="text-lg">{state.name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className={`${state.isLive ? "text-willow font-medium" : ""}`}>
                    {state.isLive ? "Available Now" : state.date}
                  </span>
                </div>
              </div>)}
          </div>
          
          <Link to="/create-will">
            
          </Link>
        </div>
      </main>
    </div>;
};
export default AvailabilityMap;