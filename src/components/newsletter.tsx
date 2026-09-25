"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setDone(true);
  };

  return (
    <section className="mx-auto mt-32 max-w-7xl px-5 lg:px-8">
      <div className="grid items-center gap-8 rounded-[2.5rem] bg-sun px-8 py-14 text-pine sm:px-14 lg:grid-cols-2 lg:py-16">
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
            Get 10% off your first order.
          </h2>
          <p className="mt-4 max-w-md text-pine/75">
            Join the list for early access to new releases and restocks. One email a week, and you can leave any time.
          </p>
        </div>
        <div className="min-h-[3.5rem]">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 rounded-full bg-pine px-6 py-4 text-mist"
              >
                <span className="grid size-8 place-items-center rounded-full bg-sun text-pine">
                  <Check className="size-4" />
                </span>
                You are on the list. Check your inbox for your code.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 rounded-full bg-paper p-2 pl-6"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-transparent outline-none placeholder:text-muted"
                />
                <button className="flex shrink-0 items-center gap-2 rounded-full bg-pine px-6 py-3 font-semibold text-mist transition hover:bg-pine-soft">
                  Subscribe
                  <Send className="size-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
