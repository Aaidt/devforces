"use client";

import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useProfile } from "@/lib/userProfile";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const { profile, loading } = useProfile();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {isLoaded && isSignedIn && !loading && profile ? (
        <RoleDashboard role={profile.user.role} name={profile.first_name} companyName={profile.user.company_name} />
      ) : (
        <Hero />
      )}
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function RoleDashboard({ role, name, companyName }: { role: "user" | "admin"; name: string; companyName?: string }) {
  return (
    <section className="relative pt-40 pb-32 px-6 max-w-5xl mx-auto overflow-hidden">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[120px] opacity-20 pointer-events-none ${role === "admin" ? "bg-emerald-500" : "bg-blue-500"}`} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative z-10"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-white/40 uppercase tracking-[0.2em] font-medium mb-6"
        >
          Welcome back
        </motion.p>
        <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
          {name}
        </h1>

        {role === "admin" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-6"
          >
            <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              {companyName || "Company"} — Hiring
            </div>
            <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              Manage your hiring contests and find the best candidates through skill-based assessments.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/profile/me" className="group bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2">
                Hiring Dashboard
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 space-y-6"
          >
            <div className="inline-flex items-center gap-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Candidate — Getting Hired
            </div>
            <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              Your developer profile is live. Compete in hiring contests and showcase your skills.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link href="/profile/me" className="group bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 flex items-center justify-center gap-2">
                View Profile & Stats
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative pt-40 pb-32 px-6 text-center max-w-5xl mx-auto overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-green-500 rounded-full blur-[120px] opacity-[0.07] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-white/60 font-medium mb-8 backdrop-blur-sm"
      >
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Now in Public Beta
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
      >
        The Operating System <br />
        for <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">Technical Hiring</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-14 leading-relaxed"
      >
        Structured evaluations. Real coding environments. Measurable skill
        signals — built for teams that hire engineers.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <Link href="/hiring/details" className="group bg-white hover:bg-zinc-100 text-black px-8 py-4 rounded-2xl font-bold text-base transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-2">
          Start Hiring
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </Link>
        <Link
          href="/CandidateDetails"
          className="px-8 py-4 rounded-2xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-base font-semibold text-white/80 flex items-center justify-center gap-2"
        >
          Get Hired
        </Link>
      </motion.div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
      ),
      title: "Standardized Assessments",
      text: "Consistent, role-specific technical evaluations that predict real performance and eliminate bias.",
      color: "green"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
      ),
      title: "Real Coding Environment",
      text: "Fully configured IDE with multi-language support. No setup required — candidates start coding instantly.",
      color: "blue"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
      ),
      title: "Deep Candidate Insights",
      text: "Analyze architecture decisions, code efficiency, and debugging patterns with actionable data.",
      color: "purple"
    },
  ];

  const colorMap: Record<string, string> = {
    green: "from-green-500/20 to-transparent border-green-500/10 text-green-400",
    blue: "from-blue-500/20 to-transparent border-blue-500/10 text-blue-400",
    purple: "from-purple-500/20 to-transparent border-purple-500/10 text-purple-400",
  };

  return (
    <section className="py-28 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-green-500 text-sm font-semibold uppercase tracking-[0.15em] mb-4"
        >
          Features
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
        >
          Built for Precision Hiring
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/40 text-lg max-w-2xl mx-auto"
        >
          Remove bias. Standardize evaluation. Identify top talent with measurable signals.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="group bg-zinc-900/30 border border-white/5 rounded-2xl p-8 hover:border-white/10 transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colorMap[f.color]?.split(" ")[0]} to-transparent`} />
            <div className="relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 ${colorMap[f.color]?.split(" ").pop()}`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">{f.title}</h3>
              <p className="text-white/40 leading-relaxed text-sm">{f.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Post Your Role", desc: "Define the position, requirements, and create a hiring contest." },
    { num: "02", title: "Candidates Compete", desc: "Engineers solve real challenges in a timed, fair environment." },
    { num: "03", title: "Review & Hire", desc: "Access detailed performance insights and hire with confidence." },
  ];

  return (
    <section className="py-28 px-6 border-y border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-green-500 text-sm font-semibold uppercase tracking-[0.15em] mb-4">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Three simple steps</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="text-5xl font-black text-white/5 mb-4">{s.num}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-28 px-6">
      <div className="text-center mb-20">
        <p className="text-green-500 text-sm font-semibold uppercase tracking-[0.15em] mb-4">Pricing</p>
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Simple, transparent pricing</h2>
        <p className="text-white/40 text-lg">Start free. Scale as you grow.</p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <PriceCard
          title="Starter"
          price="$0"
          period="/month"
          features={["5 assessments", "Basic analytics", "Email support"]}
        />
        <PriceCard
          title="Growth"
          price="$49"
          period="/month"
          highlighted
          features={[
            "Unlimited assessments",
            "Advanced insights",
            "Priority support",
            "Custom branding",
          ]}
        />
        <PriceCard
          title="Enterprise"
          price="Custom"
          period=""
          features={["Custom integrations", "Dedicated support", "SLA", "SSO"]}
        />
      </div>
    </section>
  );
}

function PriceCard({
  title,
  price,
  period,
  features,
  highlighted,
}: {
  title: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl p-8 border relative overflow-hidden transition-all duration-300 ${highlighted
        ? "border-green-500/30 bg-green-500/5 shadow-xl shadow-green-500/5 scale-[1.02]"
        : "border-white/5 bg-zinc-900/30 hover:border-white/10"
        }`}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent" />
      )}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">{title}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">{price}</span>
          {period && <span className="text-white/30 text-sm">{period}</span>}
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-white/50">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            {f}
          </li>
        ))}
      </ul>

      <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${highlighted
        ? "bg-green-500 text-black hover:bg-green-400 shadow-lg shadow-green-500/20"
        : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
        }`}>
        {highlighted ? "Get Started" : "Choose Plan"}
      </button>
    </motion.div>
  );
}

function CTA() {
  return (
    <section className="relative py-32 text-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none" />
      <div className="relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Ready to transform hiring?</h2>
        <p className="text-white/40 text-lg mb-12 max-w-lg mx-auto">
          Join modern engineering teams using Devforces to find top talent.
        </p>
        <SignUpButton mode="modal">
          <button className="bg-green-500 hover:bg-green-400 text-black px-10 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-green-500/20 transition-all hover:shadow-green-500/30 cursor-pointer">
            Get Started Free
          </button>
        </SignUpButton>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-green-500 tracking-tighter">Devforces</span>
          <span className="text-white/20 text-sm">|</span>
          <span className="text-white/30 text-sm">Hire at ease</span>
        </div>
        <p className="text-sm text-white/20">
          © {new Date().getFullYear()} Devforces Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
