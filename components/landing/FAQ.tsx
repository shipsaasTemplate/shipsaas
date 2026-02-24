"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What is included in this boilerplate?",
    answer:
      "Everything you need to launch a SaaS: Next.js 16, React 19, Tailwind CSS 4, Supabase auth, Stripe payments, email integrations, SEO configuration, and a beautiful landing page — all pre-configured and production-ready.",
  },
  {
    question: "How does pricing work?",
    answer:
      "One-time payment for lifetime access. No subscriptions, no hidden fees. You get the complete source code, all future updates, and priority support.",
  },
  {
    question: "Can I use this for multiple projects?",
    answer:
      "Absolutely! Once purchased, you can use it for unlimited personal and commercial projects. No per-project licensing.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "Priority email support for all customers, plus a dedicated Discord community for sharing tips, getting help, and connecting with other builders.",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "Yes, we offer a 30-day money-back guarantee. If the boilerplate doesn't meet your expectations, we'll issue a full refund — no questions asked.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Got questions? We&apos;ve got answers.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left bg-card/50 hover:bg-card transition-colors">
                <span className="font-medium text-foreground">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-muted-foreground transition-transform duration-200 flex-shrink-0 ml-4",
                    openIndex === index && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden">
                    <p className="p-5 pt-0 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
