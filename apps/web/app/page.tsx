"use client"

import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">

      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(34,197,94,0.15),transparent_40%)] animate-pulse" />

      <Navbar />
      <Hero />
      <ProductShowcase />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function Navbar() {
  return (
    <header className="fixed top-0 w-full backdrop-blur-xl bg-black/40 border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-semibold tracking-tight">
          Devforces
        </div>

        <div className="flex items-center gap-6 text-sm">
          <Link href="/ResumeUpload" className="text-white/70 hover:text-white transition">
            Upload Resume
          </Link>

          <SignUpButton mode="modal">
            <button className="bg-green-500 hover:bg-green-400 text-black px-5 py-2 rounded-lg font-medium transition">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-40 pb-32 px-6 text-center max-w-5xl mx-auto">

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8"
      >
        The Operating System <br />
        for <span className="text-green-500">Technical Hiring</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-xl text-white/60 max-w-2xl mx-auto mb-12"
      >
        Structured evaluations. Real coding environments. Measurable skill signals.
      </motion.p>

      <div className="flex flex-col sm:flex-row justify-center gap-5">
        <SignUpButton mode="modal">
          <button className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-green-500/20 transition">
            Start Hiring
          </button>
        </SignUpButton>

        <Link
          href="/ResumeUpload"
          className="px-8 py-4 rounded-xl border border-white/20 hover:border-white hover:bg-white/5 transition text-lg"
        >
          Upload Resume
        </Link>
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto text-center">

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
      >
        <div className="aspect-video bg-linear-to-br from-zinc-900 to-zinc-800 rounded-xl flex items-center justify-center text-white/40 text-lg">
          Product Dashboard Screenshot
        </div>
      </motion.div>
    </section>
  );
}

function Features() {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">

      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-6">
          Built for Precision Hiring
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Remove bias. Standardize evaluation. Identify top talent with measurable signals.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        <FeatureCard
          title="Standardized Assessments"
          text="Consistent, role-specific technical evaluations that predict real performance."
        />
        <FeatureCard
          title="Real Coding Environment"
          text="Fully configured IDE with multi-language support."
        />
        <FeatureCard
          title="Deep Candidate Insights"
          text="Analyze architecture, efficiency, and debugging patterns."
        />
      </div>
    </section>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-10 hover:border-green-500/40 transition"
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-white/60 leading-relaxed">{text}</p>
    </motion.div>
  );
}

function Pricing() {
  return (
    <section className="py-28 px-6 bg-white/5 border-y border-white/10">

      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold mb-6">
          Simple Pricing
        </h2>
        <p className="text-white/60 text-lg">
          Start free. Scale as you grow.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">

        <PriceCard
          title="Starter"
          price="$0"
          features={["5 assessments", "Basic analytics", "Email support"]}
        />

        <PriceCard
          title="Growth"
          price="$49"
          highlighted
          features={["Unlimited assessments", "Advanced insights", "Priority support"]}
        />

        <PriceCard
          title="Enterprise"
          price="Custom"
          features={["Custom integrations", "Dedicated support", "SLA"]}
        />

      </div>
    </section>
  );
}

function PriceCard({
  title,
  price,
  features,
  highlighted
}: {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-10 border ${
        highlighted
          ? "border-green-500 bg-green-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="text-4xl font-bold mb-6">{price}</div>

      <ul className="space-y-3 text-white/60 mb-8">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>

      <button className="w-full bg-white text-black py-3 rounded-lg font-medium hover:bg-white/90 transition">
        Choose Plan
      </button>
    </div>
  );
}

function CTA() {
  return (
    <section className="py-32 text-center">

      <h2 className="text-5xl font-bold mb-6">
        Ready to transform hiring?
      </h2>

      <p className="text-white/60 text-xl mb-12">
        Join modern engineering teams using Devforces.
      </p>

      <SignUpButton mode="modal">
        <button className="bg-green-500 hover:bg-green-400 text-black px-10 py-5 rounded-2xl text-lg font-semibold shadow-xl shadow-green-500/20 transition">
          Get Started Free
        </button>
      </SignUpButton>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-16 px-6 text-sm text-white/40 text-center">
      © {new Date().getFullYear()} Devforces Inc.
    </footer>
  );
}