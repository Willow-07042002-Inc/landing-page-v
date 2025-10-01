import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";

const Terms = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactClick = () => {
    navigate("/contact");
    window.scrollTo(0, 0);
  };

  return <div className="min-h-screen flex flex-col" style={{
    color: '#222222'
  }}>
      <Navbar />
      <main className="flex-grow pt-36 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto py-[16px]">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4" style={{
            color: '#222222'
          }}>Terms of Service</h1>
            
            <div className="text-center mb-8 text-muted-foreground" style={{
            color: '#222222'
          }}>
              Effective Date: April 1, 2025
            </div>
            
            <Separator className="my-8" />
            
            <div className="prose prose-slate max-w-none" style={{
            color: '#222222'
          }}>
              <p className="text-base leading-relaxed mb-8">Welcome to Willow! We're here to make creating and storing your will as painless as possible. But first, some ground rules to keep everything running smoothly.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Who We Are</h2>
              <p className="text-base leading-relaxed mb-6">Willow is operated by 07042002 Inc., a Delaware Corporation ("we," "us," or "our"). By accessing or using our website, application, or services (collectively, the "Service"), you agree to these Terms. If you don't agree, that's cool—but you won't be able to use Willow.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">What We Do</h2>
              <p className="text-base leading-relaxed mb-6">We help you create, sign, and manage your will. Here's what you can do with Willow:</p>
              
              <h3 className="text-xl font-heading font-semibold mb-3">What's Free:</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">Create your will and save it for later. No rush, keep it on our platform until you're ready to make it official.</li>
                <li className="text-base leading-relaxed">Share your drafted will with trusted individuals for feedback. They can view it for free anytime.</li>
                <li className="text-base leading-relaxed">View documents others have shared with you.</li>
              </ul>
              
              <h3 className="text-xl font-heading font-semibold mb-3">What Requires Payment:</h3>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">Sign your will to make it legally official.</li>
                <li className="text-base leading-relaxed">Store your signed will securely. With Willow, your will stays safe and accessible.</li>
                <li className="text-base leading-relaxed">Share signed documents with anyone you trust.</li>
                <li className="text-base leading-relaxed">Update your will anytime, as often as you need.</li>
                <li className="text-base leading-relaxed">Receive friendly update recommendations to keep your will current.</li>
              </ul>
              
              <p className="text-base leading-relaxed mb-4">Just so you know:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">We're not giving legal advice—just reminders to check if your will needs updating.</li>
                <li className="text-base leading-relaxed">You're responsible for keeping your will accurate and up-to-date. We can't do that for you.</li>
              </ul>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Subscriptions & Payments</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">Willow is a subscription service with yearly billing.</li>
                <li className="text-base leading-relaxed">Subscription pricing is as listed on our website and may be updated from time to time.</li>
                <li className="text-base leading-relaxed">Your subscription renews automatically unless you cancel. No hidden fees.</li>
                <li className="text-base leading-relaxed">Cancel anytime through your user portal. If you do, we'll email you a copy of your will and any related files (like video and audio recordings of the signing).</li>
                <li className="text-base leading-relaxed">No refunds unless required by law.</li>
                <li className="text-base leading-relaxed">Our authentication process may change as we improve Willow.</li>
              </ul>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">What You're Responsible For</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">To use Willow, you must be at least 18 years old and of sound mind to create a legally valid will.</li>
                <li className="text-base leading-relaxed">Keeping your information accurate and up-to-date. If life changes, make sure your will reflects it.</li>
                <li className="text-base leading-relaxed">Keeping your login details safe. Passwords matter—don't share them.</li>
                <li className="text-base leading-relaxed">Understanding that Willow doesn't provide legal advice. We help you create and store your will based on what you tell us about who you are, what you have, and who you want to give it to (including your children). Making sure it reflects your wishes and is legally valid is your responsibility.</li>
                <li className="text-base leading-relaxed">Right now, Willow only operates in Colorado and is as such only available to residents of Colorado. If you move or use Willow from another state, it's your job to confirm your will is legally valid there. We cannot guarantee it will be legally binding outside of Colorado.</li>
              </ul>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">What We're Not Responsible For - Legal Advice</h2>
              <p className="text-base leading-relaxed mb-6">Willow is designed to help you document your decisions legally, not to advise on what decisions to make. For example, we're not here to tell you which aunt or uncle to list as a guardian for your children—we're simply here to make sure you have the ability to communicate your preferences in a legally recognized format. For complex estates or specific legal questions, including but not limited to estate tax planning and/or special needs trusts, we recommend consulting with a qualified attorney.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Ownership & Restrictions</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">Willow owns all trademarks, logos, and service content.</li>
                <li className="text-base leading-relaxed">You can't copy, reproduce, or distribute any part of Willow without permission.</li>
              </ul>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Account Termination</h2>
              <p className="text-base leading-relaxed mb-6">Willow reserves the right to terminate accounts for fraudulent activity or behavior we determine, in our sole discretion, to be harmful to our platform or other users. Users engaged in such behavior may lose access to their account and stored documents. We will make a judgment based on the extent of the situation regarding access to documents and account restoration. In cases of illegal activity, we may pursue appropriate legal remedies. Examples of prohibited behavior include, but are not limited to, creating wills for others without proper authorization, intentionally providing false information, or using our platform to commit fraud.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Liability</h2>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">Willow is provided "as-is." We do our best, but we can't guarantee perfection.</li>
                <li className="text-base leading-relaxed">We're not responsible for any losses or damages from using Willow, except as required by law.</li>
              </ul>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Privacy</h2>
              <p className="text-base leading-relaxed mb-6">Your use of Willow is also governed by our Privacy Policy. Check it out to understand how your data is collected, used, and protected.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Service Availability</h2>
              <p className="text-base leading-relaxed mb-6">Willow may experience minor service interruptions for maintenance or updates. We will attempt to provide notice when possible. In case of urgent document access needs during an outage, please contact our support hotline at [phone number].</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Canceling Your Account</h2>
              <p className="text-base leading-relaxed mb-6">You can cancel anytime. We'll email you a copy of your will and related files if you do.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Death of User</h2>
              <p className="text-base leading-relaxed mb-6">After death, your will remains private until probate. Willow will only send the will to your designated executor if the document has not yet been shared. Once the executor files the will for probate, it becomes a public record in accordance with court procedures. Willow will not independently make your will public, but cannot control its public status once filed with the courts.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Dispute Resolution</h2>
              <p className="text-base leading-relaxed mb-6">Any disputes arising from your use of Willow will be resolved according to applicable law. Disputes related to the Terms of Service will be governed by Delaware law, while disputes related to will validity will be subject to Colorado law.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Governing Law</h2>
              <p className="text-base leading-relaxed mb-6">Willow is a Delaware corporation, so Delaware law protects us. However, we comply with Colorado state law to ensure your will is legally valid within Colorado.</p>
              <p className="text-base leading-relaxed mb-6">Willow only operates in Colorado. If you move or use Willow from another state, you're responsible for ensuring your will is legally binding there.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Changes to These Terms</h2>
              <p className="text-base leading-relaxed mb-6">We may update these Terms from time to time. If we do, we'll let you know.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Getting in touch with Us</h2>
              <p className="text-base leading-relaxed mb-6">Got questions? Fill out the Contact Us form, and we'll get back to you as soon as possible. We're here to help!</p>
              <p className="text-base leading-relaxed mb-6">
                <button 
                  onClick={handleContactClick} 
                  className="text-willow-500 hover:text-willow-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  Contact Us
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default Terms;

