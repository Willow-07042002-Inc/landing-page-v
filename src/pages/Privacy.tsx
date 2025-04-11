import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{
      color: '#222222'
    }}>
      <Navbar />
      <main className="flex-grow pt-36 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto py-[16px]">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4" style={{
              color: '#222222'
            }}>Privacy Policy</h1>
            
            <div className="text-center mb-8 text-muted-foreground" style={{
              color: '#222222'
            }}>
              Effective Date: April 1, 2025
            </div>
            
            <Separator className="my-8" />
            
            <div className="prose prose-slate max-w-none" style={{
              color: '#222222'
            }}>
              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Willow's Privacy Promise</h2>
              <p className="text-base leading-relaxed mb-6">Plain language. No shady stuff. Just the facts about how we use your info.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Why this exists</h2>
              <p className="text-base leading-relaxed mb-6">Let's be real—privacy policies are usually written by lawyers for other lawyers. But at Willow, we help people deal with big, personal, life things. So we're writing this in plain English, not legalese. This page tells you what info we collect, why we collect it, who we share it with (spoiler: just a couple of trusted partners), and what rights you have over your data. No dark patterns, no fine print tricks.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">What We Collect and Why</h2>
              <p className="text-base leading-relaxed mb-6">Here's exactly what we collect and why we need it:</p>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-3 text-left">What We Collect</th>
                      <th className="border p-3 text-left">Why We Collect It</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-3">Your name and contact info</td>
                      <td className="border p-3">To create your account, generate your Will, contact you if needed, and let you log back in securely.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Date of birth</td>
                      <td className="border p-3">To confirm you're old enough to make a Will, and generate your Will.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">State of Residence</td>
                      <td className="border p-3">To confirm we can offer you our service, and generate your Will.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">List of assets + who gets what</td>
                      <td className="border p-3">So we can generate your Will according to your wishes.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Names and roles (beneficiaries, executors, guardians)</td>
                      <td className="border p-3">To generate a valid Will with proper fallback options.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Email + optional phone number</td>
                      <td className="border p-3">Used for logins, account recovery, and important alerts.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Info about children (if added)</td>
                      <td className="border p-3">Needed for guardianship instructions so we can accurately generate your Will.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">Payment info</td>
                      <td className="border p-3">Collected and processed securely by Stripe for subscriptions or services.</td>
                    </tr>
                    <tr>
                      <td className="border p-3">How you use Willow</td>
                      <td className="border p-3">To keep things running smoothly, improve features, and squash bugs.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-base leading-relaxed mb-6">We keep it lean. If we don't need it, we don't ask for it.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">How We Use Your Data</h2>
              <p className="text-base leading-relaxed mb-6">We use your info to help you create and manage your Will in a way that's fast, secure, and legally sound. That includes setup, storage, signing, and updates as life changes.</p>

              <p className="text-base leading-relaxed mb-6">We also use your data to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">Keep your account running smoothly</li>
                <li className="text-base leading-relaxed">Send reminders or helpful updates</li>
                <li className="text-base leading-relaxed">Let you know about new features (only if you want us to)</li>
                <li className="text-base leading-relaxed">Confirm it's really you when needed</li>
                <li className="text-base leading-relaxed">Fix bugs and improve the experience</li>
                <li className="text-base leading-relaxed">Process payments securely</li>
                <li className="text-base leading-relaxed">Stay compliant with the law</li>
                <li className="text-base leading-relaxed">Do other things you've clearly agreed to</li>
              </ul>

              <p className="text-base leading-relaxed mb-6">The Colorado Privacy Act also allows companies to sell personal data. As of the date this policy took effect, Willow does not sell personal data, but if that ever changes, you'll be notified—and you'll always have the right to opt out.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Who We Share It With</h2>
              <p className="text-base leading-relaxed mb-6">As of now, we only share your information with a few trusted partners—Stripe (payments), AWS (secure hosting), and SignWell (digital signing)—who help us deliver Willow safely and smoothly.</p>
              <p className="text-base leading-relaxed mb-6">We may also share data with other vetted partners in the future to improve the product, but only when necessary and always with your privacy in mind.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Your Privacy Rights</h2>
              <p className="text-base leading-relaxed mb-6">If you live in Colorado, the Colorado Privacy Act gives you the right to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li className="text-base leading-relaxed">Access the personal data we have about you</li>
                <li className="text-base leading-relaxed">Correct inaccurate or outdated info</li>
                <li className="text-base leading-relaxed">Delete your data (unless we're legally required to keep it)</li>
                <li className="text-base leading-relaxed">Download your data and take it somewhere else</li>
                <li className="text-base leading-relaxed">Opt out of profiling and targeted advertising (we don't profile users)</li>
                <li className="text-base leading-relaxed">Opt out of the sale of personal data (even though we don't sell it now)</li>
                <li className="text-base leading-relaxed">Appeal any decision we make if we deny a rights request</li>
                <li className="text-base leading-relaxed">Unsubscribe from feature updates, reminders, or product-related emails</li>
              </ul>
              <p className="text-base leading-relaxed mb-6">You can manage these rights from your Willow account settings, or reach out anytime at privacy@willow.com. We'll respond within 45 days (often sooner).</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">How We Keep Your Info Safe</h2>
              <p className="text-base leading-relaxed mb-6">(working on this)</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">How Long We Keep Your Data</h2>
              <p className="text-base leading-relaxed mb-6">(working on this)</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Changes to This Policy</h2>
              <p className="text-base leading-relaxed mb-6">If anything major changes, we'll update this page—and if it's important, we'll email you too. We encourage you to check in once in a while, but no pressure.</p>

              <h2 className="text-2xl font-heading font-semibold mb-4 mt-10">Talk to Us</h2>
              <p className="text-base leading-relaxed mb-6">Have questions? Want to update your info? Just curious how we're handling something?</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
