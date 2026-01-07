import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Category = "Will Basics" | "Guardianship & Family" | "Executor & Responsibilities" | "Life Changes & Updates" | "Signatures & Witnessing";

interface FAQItem {
  question: string;
  answer: string;
  category: Category;
}

const faqData: FAQItem[] = [
  // Will Basics
  {
    question: "What is a Will?",
    answer: "A Will directs what you want to happen to your property and assets and who will care for your children after you pass away.",
    category: "Will Basics"
  },
  {
    question: "Who needs a Will?",
    answer: "Anyone over 18 can benefit from having a Will, no matter their situation. It states your wishes and prevents important decisions from being left to the government.",
    category: "Will Basics"
  },
  {
    question: "How does a Will protect my kids if something happens to my spouse and I?",
    answer: "A Will lets you declare who you prefer to care for your children and how they'll be provided for financially. With your preferences stated, the court will decide in the best interests of the child who will be the guardian.",
    category: "Will Basics"
  },
  {
    question: "What happens if I don't have a Will at all?",
    answer: "Without a Will, state laws decide who inherits your property and who will care for your children. These rules often divide things in ways you might not agree with.",
    category: "Will Basics"
  },
  {
    question: "Do both parents need their own separate Wills, or can we share one?",
    answer: "Each person must have their own Will for it to be valid.",
    category: "Will Basics"
  },
  // Guardianship & Family
  {
    question: "What is a Guardian?",
    answer: "A guardian role includes managing the child's finances and making decisions about their daily life, education, and well-being.",
    category: "Guardianship & Family"
  },
  {
    question: "How do I choose a guardian for my children — and what should I consider when making that decision?",
    answer: "Pick someone you trust completely, who shares your values, and who's willing to take on the responsibility. Also consider their age, health, where they live, parenting skills, relationship with your children, and any other factors you feel are important for raising children.",
    category: "Guardianship & Family"
  },
  {
    question: "What happens if I haven't named a guardian in my Will or the person I name as guardian can't or won't serve?",
    answer: "If you haven't named a guardian or your chosen guardian cannot serve, friends and family have the option to step forward and express their interest in being their guardian. Ultimately the court will appoint someone based on your children's best interests.",
    category: "Guardianship & Family"
  },
  {
    question: "How often should I revisit my guardian choice as my kids grow up?",
    answer: "It's a good idea to review your choice every couple of years or after major life changes. As your children's needs change and relationships evolve, you may want to update your selection.",
    category: "Guardianship & Family"
  },
  // Executor & Responsibilities
  {
    question: "What's the difference between an executor and a personal representative?",
    answer: "In many ways — they are the same role, but different states use different terms. Colorado uses the term personal representative, which is simply the modern legal term for executor. Both mean the person responsible for handling your estate after you pass away.",
    category: "Executor & Responsibilities"
  },
  {
    question: "What does a personal representative actually do?",
    answer: "First a personal representative will petition the court to approve your Will and formally empower your personal representative to act on behalf of your estate. Once approved, your personal representative carries out the instructions in your Will. This includes managing your property, paying debts and taxes, and distributing assets to the people you've named.",
    category: "Executor & Responsibilities"
  },
  {
    question: "Can my spouse and I name each other as personal representatives/executors?",
    answer: "You can name each other as executors, but it's smart to name an alternate in case your spouse can't serve.",
    category: "Executor & Responsibilities"
  },
  {
    question: "What if my personal representative/executor lives in another state?",
    answer: "An out-of-state personal representative is usually allowed, but it can often cause delays or require extra steps.",
    category: "Executor & Responsibilities"
  },
  // Life Changes & Updates
  {
    question: "How often should I update my Will?",
    answer: "Willow recommends that you review your Will every year. If your Will no longer reflects your wishes or current situation, which often occurs after major life events — such as having a child, getting married, divorce, accumulating assets, or moving to a new state then you should update your Will.",
    category: "Life Changes & Updates"
  },
  {
    question: "How easy is it to update my Will through Willow?",
    answer: "Willow makes it extremely easy. While we can't keep track of everything, we do our best to suggest updates when we feel a revision might be needed.\n\nWhen you want to make an update, you just let us know what needs to be fixed and we go ahead and revise your will for you. After that, all that's left is to sign it to make it official.",
    category: "Life Changes & Updates"
  },
  {
    question: "If I move to a new state, what happens to my existing Will?",
    answer: "Provided your Will was executed correctly under the laws of your original state, your Will should be recognized by all other states across the country.",
    category: "Life Changes & Updates"
  },
  {
    question: "How is a Will I created years ago affected by my most recent Will?",
    answer: "Your most recent valid Will generally revokes any older versions. Only the newest one will be followed.",
    category: "Life Changes & Updates"
  },
  // Signatures & Witnessing
  {
    question: "I've heard Wills need to be notarized — is that true in every state?",
    answer: "In Colorado, where Willow is currently available, notarization is not required. While more 'traditional' wills with pen and paper have not required a notarization. Some states require electronic Wills to be notarized, while others just require two witnesses.",
    category: "Signatures & Witnessing"
  },
  {
    question: "How does Willow handle notarization and witness requirements online?",
    answer: "Our team has over 35 years of estate planning experience, which we use every day to ensure everything stays compliant.",
    category: "Signatures & Witnessing"
  },
  {
    question: "What happens if I sign my Will but forget to have it witnessed correctly?",
    answer: "If your Will isn't properly witnessed, it may be ruled invalid — meaning state laws and a judge will decide what happens to your children and property.",
    category: "Signatures & Witnessing"
  }
];

const categories: Category[] = [
  "Will Basics",
  "Guardianship & Family",
  "Executor & Responsibilities",
  "Life Changes & Updates",
  "Signatures & Witnessing"
];

const Learn = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Will Basics");

  const filteredFAQs = faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col" style={{
      color: '#222222'
    }}>
      <Navbar />
      <main className="flex-grow pt-36 pb-24">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-medium text-center mb-4 sm:mb-6 px-4" style={{
              color: '#222222',
              lineHeight: '1.2'
            }}>Wills, Explained</h1>
            
            <div className="text-center mb-8 sm:mb-12 text-base sm:text-lg md:text-xl leading-relaxed px-4" style={{
              color: '#222222'
            }}>
              Wills should be easy to understand and accessible to everyone. That's why we created this will dictionary highlighting the terms you need to know, in plain English💡.
            </div>
            
            <Separator className="my-8 sm:my-12" />
            
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-12 justify-center px-2 sm:px-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-2.5 py-1.5 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full text-[11px] sm:text-sm md:text-base font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === category
                      ? 'bg-willow-50 border-2 border-willow-500 text-willow-700'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Accordion Content */}
            <div className="prose prose-slate max-w-none" style={{
              color: '#222222'
            }}>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                    <AccordionTrigger className="text-left font-semibold text-lg md:text-xl py-6 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-lg leading-relaxed text-gray-700 pb-6">
                      {faq.answer.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className={idx > 0 ? 'mt-4' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;

