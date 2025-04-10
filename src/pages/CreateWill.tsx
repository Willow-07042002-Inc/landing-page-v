
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const CreateWill = () => {
  const {
    toast
  } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailIsFocused, setEmailIsFocused] = useState(false);
  const [state, setState] = useState("");
  const [isSubmittingState, setIsSubmittingState] = useState(false);
  const [isStateSelected, setIsStateSelected] = useState(false);
  const [stateIsFocused, setStateIsFocused] = useState(false);
  const [currentForm, setCurrentForm] = useState("state");
  const [showComingSoonDialog, setShowComingSoonDialog] = useState(false);

  useEffect(() => {
    setIsValidEmail(email.includes("@") && email.length > 5);
  }, [email]);

  useEffect(() => {
    setIsStateSelected(state.length > 0);
  }, [state]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address"
      });
      return;
    }
    setIsSubmittingEmail(true);
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "We've received your email."
      });
      setIsSubmittingEmail(false);
      setShowComingSoonDialog(true);
    }, 1500);
    console.log("Email submitted:", email);
  };

  const handleStateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStateSelected) {
      toast({
        variant: "destructive",
        title: "State Required",
        description: "Please select your state of residence"
      });
      return;
    }
    setIsSubmittingState(true);
    setTimeout(() => {
      setIsSubmittingState(false);
      setCurrentForm("email");
    }, 1500);
    console.log("State submitted:", state);
  };

  const US_STATES = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming", "District of Columbia"];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-0 pb-16 mt-[-6rem]">
        <div className="w-full max-w-md mx-auto text-center animate-fade-in">
          {currentForm === "state" && <>
              <h1 className="text-3xl md:text-4xl font-light mb-10 mt-16">What is your state of residence?</h1>
              
              <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleStateSubmit} className="space-y-6">
                  <div className="relative">
                    <div className={`flex items-center rounded-md border-2 transition-colors overflow-hidden 
                      ${stateIsFocused ? 'border-willow' : 'border-input'}
                      ${state ? 'border-willow/50' : ''}`}>
                      <div className="pl-3">
                        <MapPin size={20} className="text-muted-foreground" />
                      </div>
                      <Select value={state} onValueChange={value => {
                    setState(value);
                  }} onOpenChange={open => setStateIsFocused(open)}>
                        <SelectTrigger className="border-0 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none pl-2 w-full">
                          <SelectValue placeholder="SELECT YOUR STATE" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px] w-full">
                          {US_STATES.map(stateName => <SelectItem key={stateName} value={stateName}>
                              {stateName}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isSubmittingState || !isStateSelected} className={`w-full py-6 text-lg font-normal hover:opacity-90 transition-all ${isStateSelected ? 'willow-btn' : 'bg-gray-300 text-white'}`}>
                    {isSubmittingState ? "Submitting..." : "CONTINUE"}
                  </Button>
                </form>
                
                <p className="text-sm text-muted-foreground mt-6">
                  Your state of residence helps us create a Will that complies with your local laws.
                </p>
              </div>
            </>}

          {currentForm === "email" && <>
              <h1 className="text-3xl md:text-4xl font-light mb-10 mt-16">Let's make this quick</h1>
              
              <div className="w-full max-w-md mx-auto">
                <form onSubmit={handleEmailSubmit} className="space-y-6">
                  <div className="relative">
                    <div className={`flex items-center rounded-md border-2 transition-colors overflow-hidden 
                      ${emailIsFocused ? 'border-willow' : 'border-input'}
                      ${email ? 'border-willow/50' : ''}`}>
                      <div className="pl-3">
                        <Mail size={20} className="text-muted-foreground" />
                      </div>
                      <Input type="email" placeholder="EMAIL ADDRESS" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setEmailIsFocused(true)} onBlur={() => setEmailIsFocused(false)} className="border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none pl-2 w-full" />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isSubmittingEmail || !isValidEmail} className={`w-full py-6 text-lg font-normal hover:opacity-90 transition-all ${isValidEmail ? 'willow-btn' : 'bg-gray-300 text-white'}`}>
                    {isSubmittingEmail ? "Submitting..." : "CONTINUE"}
                  </Button>
                </form>
                
                <p className="text-sm text-muted-foreground mt-6">
                  We'll use your email to send you important information about your Will.
                </p>
              </div>
            </>}
        </div>
      </main>

      <Dialog open={showComingSoonDialog} onOpenChange={setShowComingSoonDialog}>
        <DialogContent className="sm:max-w-md px-6 pt-6 pb-6">
          <DialogHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <img src="/lovable-uploads/0f8b3b1d-f883-4294-a922-15b61c180de1.png" alt="Willow Logo" className="h-16 w-auto" />
            </div>
            <DialogTitle className="text-2xl text-center mb-2 py-0">We're almost there!</DialogTitle>
            <DialogDescription className="text-center mb-12">
              Willow isn't live in {state} just yet—
              but we're working hard to bring our service to your state soon.

              We'll let you know as soon as we launch in your area.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Link to="/availability-map">
              <Button className="willow-btn w-full sm:w-auto" onClick={() => setShowComingSoonDialog(false)}>
                See Where Willow is Live
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateWill;
