"use client";

import Link from "next/link";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { Brain, Code2, BarChart3, Puzzle } from 'lucide-react';
import { motion } from "framer-motion";
import { useProfile } from "@/lib/userProfile";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const { profile, loading } = useProfile();

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 selection:bg-emerald-500/30 font-sans">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed top-1/3 right-1/4 w-72 h-72 bg-cyan-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {isLoaded && isSignedIn && !loading && profile ? (
        <RoleDashboard role={profile.user.role} name={profile.first_name} companyName={profile.user.company_name} />
      ) : (
        <Hero />
      )}
      <TrustedBy />
      {/* <Features /> */}
      <FeaturesBento />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}

function RoleDashboard({ role, name, companyName }: { role: "user" | "admin"; name: string; companyName?: string }) {
  const isAdmin = role === "admin";

  return (
    <section className="relative pt-44 pb-32 px-6 max-w-5xl mx-auto">
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[140px] opacity-20 pointer-events-none ${isAdmin ? "bg-emerald-500" : "bg-blue-500"}`} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <p className="text-xs text-emerald-500/80 uppercase tracking-[0.3em] font-bold mb-4">
          Personal Workspace
        </p>
        <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter mb-8">
          <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">Hello, </span>
          <span className="italic bg-gradient-to-r from-emerald-300 to-cyan-400 bg-clip-text text-transparent">{name}</span>
        </h1>

        <div className="flex flex-col items-center gap-6">
          <div className={`inline-flex items-center gap-2.5 ${isAdmin ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400" : "bg-blue-500/5 border-blue-500/20 text-blue-400"} border px-5 py-2 rounded-full text-sm font-medium backdrop-blur-md`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${isAdmin ? "bg-emerald-500" : "bg-blue-500"}`} />
            {isAdmin ? "Recruiter Access" : "Developer Account"}
          </div>
          
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            {isAdmin 
              ? <>Managing talent acquisition for <span className="text-slate-300 font-semibold">{companyName || "your organization"}</span>.</> 
              : "Ready to showcase your technical skills and compete in hiring contests."}
          </p>

          <Link href="/profile/me" className={`mt-4 cursor-pointer group ${isAdmin ? "bg-emerald-500 text-black hover:bg-emerald-400" : "bg-blue-500 text-white hover:bg-blue-400"} px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-2xl ${isAdmin ? "shadow-emerald-500/20" : "shadow-blue-500/20"}`}>
            Enter Dashboard
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative pt-48 pb-28 px-6 text-center max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[11px] text-emerald-400 font-bold uppercase tracking-widest mb-10 backdrop-blur-sm"
      >
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        AI-Powered Technical Hiring
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-[5.5rem] font-black leading-[0.95] tracking-tight mb-10"
      >
        <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">Hire engineers with </span>
        <br />
        <span className="italic bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">AI-evaluated</span>
        <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"> skill signals.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 leading-relaxed"
      >
        Automated coding assessments, real-time AI analysis, and measurable 
        performance data — built for teams that want to <span className="text-slate-300 font-medium">eliminate hiring bias</span>.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row justify-center gap-5"
      >
        <Link href="/hiring/details" className="cursor-pointer group bg-white text-black px-10 py-4 rounded-2xl font-bold text-base transition-all hover:bg-emerald-400 flex items-center justify-center gap-2.5 shadow-xl shadow-white/5">
          Start Hiring
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </Link>
        <Link href="/CandidateDetails" className="cursor-pointer px-10 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all text-base font-bold text-white flex items-center justify-center gap-2 backdrop-blur-md">
          Get Hired
        </Link>
      </motion.div>
    </section>
  );
}

function TrustedBy() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 px-6 border-y border-white/5"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-[11px] text-slate-600 uppercase tracking-[0.25em] font-bold mb-6">Trusted by engineering teams at</p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-slate-600/60">
          {["TechCorp", "ScaleAI", "DevStack", "CloudBase", "NeuralOps"].map((name) => (
            <span key={name} className="text-sm font-bold tracking-wider">{name}</span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function Features() {
  const features = [
    {
      title: "AI-Scored Assessments",
      text: "Role-specific technical evaluations scored by AI models that predict real-world performance with measurable accuracy.",
      icon: "🎯",
      detail: "GPT-4 powered scoring"
    },
    {
      title: "Cloud IDE",
      text: "Zero-config coding environments with 20+ language runtimes. Candidates start solving challenges in seconds.",
      icon: "💻",
      detail: "< 2s cold start"
    },
    {
      title: "Deep Analytics",
      text: "AI-generated candidate reports analyzing code architecture, efficiency patterns, and problem-solving approaches.",
      icon: "📊",
      detail: "Real-time insights"
    },
  ];

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-16">
        <p className="text-[11px] text-emerald-500/70 uppercase tracking-[0.25em] font-bold mb-4">Capabilities</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
          <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">The </span>
          <span className="italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">intelligent</span>
          <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"> hiring stack.</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((f) => (
          <motion.div
            key={f.title}
            whileHover={{ y: -6 }}
            className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] transition-all duration-300 group relative overflow-hidden hover:bg-emerald-500/[0.06]"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="text-3xl mb-5">{f.icon}</div>
            <h3 className="text-lg font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">{f.title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm mb-4">{f.text}</p>
            <span className="text-[11px] font-bold text-emerald-500/50 uppercase tracking-widest">{f.detail}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "Define", desc: "Create role-specific contests with custom challenges and time limits." },
    { n: "02", title: "Evaluate", desc: "Candidates compete in fair, proctored cloud environments." },
    { n: "03", title: "Hire", desc: "AI-generated reports rank candidates by skill, not résumé." },
  ];

  return (
    <section className="py-32 px-6 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-[11px] text-emerald-500/70 uppercase tracking-[0.25em] font-bold mb-4">Process</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
            <span className="italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Three steps</span>
            <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"> to better hires.</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center group"
            >
              <span className="text-9xl font-black text-white/[0.05] absolute -top-10 left-1/2 -translate-x-1/2 select-none pointer-events-none">{s.n}</span>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">{s.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="py-32 px-6">
      <div className="text-center mb-16">
        <p className="text-[11px] text-emerald-500/70 uppercase tracking-[0.25em] font-bold mb-4">Pricing</p>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
          <span className="italic bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Scalable</span>
          <span className="bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"> pricing.</span>
        </h2>
        <p className="text-slate-500 text-sm">Built to grow with your engineering team.</p>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
        <PriceCard title="Starter" price="$0" features={["5 assessments / month", "Basic AI scoring", "Email support"]} />
        <PriceCard title="Growth" price="$49" highlighted features={["Unlimited assessments", "Advanced AI analytics", "Priority support", "Custom branding"]} />
        <PriceCard title="Enterprise" price="Custom" features={["Custom integrations", "Dedicated CSM", "SLA & SSO", "Team management"]} />
      </div>
    </section>
  );
}

function PriceCard({ title, price, features, highlighted }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-8 rounded-2xl border transition-all duration-500 relative overflow-hidden ${highlighted ? 'bg-emerald-500/5 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 md:scale-105' : 'bg-zinc-900/40 border-white/[0.06] hover:border-white/10'}`}
    >
      {highlighted && (
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      )}
      <h3 className={`text-[11px] font-black uppercase tracking-widest mb-6 ${highlighted ? 'text-emerald-400' : 'text-slate-600'}`}>{title}</h3>
      <div className="text-4xl font-black mb-1">{price}</div>
      {price !== "Custom" && <p className="text-slate-600 text-xs mb-8">/month</p>}
      {price === "Custom" && <p className="text-slate-600 text-xs mb-8">contact us</p>}
      <ul className="space-y-3.5 mb-10">
        {features.map((f: string) => (
          <li key={f} className="flex items-center gap-3 text-sm text-slate-400">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            {f}
          </li>
        ))}
      </ul>
      <button className={`cursor-pointer w-full py-3.5 rounded-xl font-bold text-sm transition-all ${highlighted ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20' : 'bg-white/5 hover:bg-white/10 border border-white/5'}`}>
        {highlighted ? "Get Started" : "Choose Plan"}
      </button>
    </motion.div>
  );
}

function CTA() {
  return (
    <section className="py-32 px-6 text-center">
      <div className="max-w-3xl mx-auto p-12 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-emerald-500 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff22,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#00000022,transparent_50%)]" />
        <h2 className="text-3xl md:text-5xl font-black text-black mb-4 relative z-10 tracking-tighter leading-tight">
          Ready to <span className="italic">evolve</span> your<br />hiring process?
        </h2>
        <p className="text-black/60 text-sm md:text-base mb-8 relative z-10 max-w-md mx-auto">
          Join hundreds of engineering teams using AI-powered assessments to find top talent.
        </p>
        <SignUpButton mode="modal">
          <button className="cursor-pointer bg-black text-white px-12 py-5 rounded-2xl text-lg font-black transition-all hover:bg-zinc-800 shadow-2xl relative z-10">
            Join Devforces Now
          </button>
        </SignUpButton>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="font-black text-xl text-white tracking-tighter">Devforces</span>
          <span className="text-slate-600 text-sm italic">/ AI-powered hiring.</span>
        </div>
        <p className="text-[11px] font-bold text-slate-700 tracking-widest uppercase">
          © {new Date().getFullYear()} Devforces Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const FeaturesBento = () => {
  return (
    <section className="bg-[#0e0e0e] py-24 px-6 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            The intelligent hiring stack
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4edea3] to-[#4cd7f6]" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">
          
          {/* AI Assessments - Large Card */}
          <div className="md:col-span-7 row-span-1 bg-[#1a1a1a] rounded-3xl p-10 relative overflow-hidden group border border-white/5 transition-all duration-500">
            <div className="relative z-10 flex flex-col h-full">
              <div className="bg-[#4edea3]/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-[#4edea3] w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold mb-4">AI assessments</h3>
              <p className="text-zinc-400 max-w-sm leading-relaxed text-lg">
                Our neural engine analyzes code quality, architectural decisions, and edge-case handling in real-time. No more generic multiple-choice questions.
              </p>
            </div>
            {/* Background Decorative Icon */}
            <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Brain size={280} strokeWidth={1} />
            </div>
          </div>

          {/* Cloud IDE - Side Card */}
          <div className="md:col-span-5 row-span-1 bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 transition-all group">
            <div className="bg-[#4cd7f6]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-6">
              <Code2 className="text-[#4cd7f6] w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Cloud IDE</h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              A fully integrated environment with pre-configured stacks. Candidates build real features, not just algorithms.
            </p>
            {/* Terminal Preview */}
            <div className="mt-auto bg-black/40 rounded-xl p-4 font-mono text-xs border border-white/5">
              <div className="flex gap-2">
                <span className="text-[#4edea3]">$</span>
                <span className="text-zinc-300">npm install @devforces/core</span>
              </div>
              <div className="flex gap-2 mt-1 opacity-40">
                <span>&gt;</span>
                <span>Initializing assessment sandbox...</span>
              </div>
            </div>
          </div>

          {/* Deep Analytics - Bottom Left */}
          <div className="md:col-span-5 row-span-1 bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 transition-all">
            <div className="bg-[#4edea3]/10 w-10 h-10 rounded-lg flex items-center justify-center mb-6">
              <BarChart3 className="text-[#4edea3] w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Compare candidates across 40+ engineering dimensions with proprietary skill-mapping technology.
            </p>
          </div>

          {/* Native Integrations - Bottom Right */}
          <div className="md:col-span-7 row-span-1 bg-[#1a1a1a] rounded-3xl p-8 border border-white/5 transition-all flex items-center justify-between group">
            <div className="max-w-xs">
              <h3 className="text-2xl font-bold mb-2">Native Integrations</h3>
              <p className="text-zinc-400 text-sm">Sync seamlessly with Slack, Greenhouse, and Lever.</p>
            </div>
            {/* Integration Icons Box */}
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                <Puzzle className="text-zinc-400 w-6 h-6" />
              </div>
              <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                <div className="w-6 h-6 border-2 border-zinc-500 rounded-sm rotate-45 flex items-center justify-center">
                  <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};