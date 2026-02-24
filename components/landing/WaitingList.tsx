"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { joinWaitingList, getWaitingListCount } from "@/lib/waiting-list";

export default function WaitingList() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);

  const { waitingList: config } = siteConfig;

  useEffect(() => {
    if (config.showCount) {
      getWaitingListCount().then((c) => {
        if (c !== null) setCount(c);
      });
    }
  }, [config.showCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const result = await joinWaitingList(email);

    if (result.success) {
      setStatus("success");
      setMessage(config.successMessage);
      setEmail("");
      if (count !== null) setCount(count + 1);
    } else {
      if (result.message === "duplicate") {
        setStatus("success");
        setMessage(config.duplicateMessage);
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    }
  };

  return (
    <section id="pricing" className="py-24 relative">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {config.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {config.subtitle}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="max-w-lg mx-auto">
          <div className="relative p-8 rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-600/10 to-transparent backdrop-blur-sm">
            {/* Glow ring */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-violet-500/20 to-transparent pointer-events-none" />

            <div className="relative">
              {status === "success" ? (
                /* Success state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    {message}
                  </p>
                  {config.showCount && count !== null && (
                    <p className="text-sm text-muted-foreground">
                      You&apos;re #{count} on the list
                    </p>
                  )}
                </motion.div>
              ) : (
                /* Form state */
                <>
                  {config.showCount && count !== null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 mb-6">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <Users className="w-3.5 h-3.5 text-violet-400" />
                        <span className="text-sm text-violet-300 font-medium">
                          {count.toLocaleString()}+ people already joined
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === "error") setStatus("idle");
                        }}
                        placeholder={config.placeholder}
                        required
                        className="w-full h-12 px-4 rounded-xl bg-background/60 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full h-12 text-base font-medium"
                      size="lg">
                      {status === "loading" ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          {config.buttonText}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  {status === "error" && message && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-400 text-center mt-3">
                      {message}
                    </motion.p>
                  )}

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
