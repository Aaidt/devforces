import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans overflow-x-hidden flex flex-col">
      {/* Hero Section */}
      <main className="pt-32 pb-20 px-8 bg-[#0a0a0a] border-b border-white/10 flex flex-col items-center justify-center text-center">
        <div className="max-w-[900px] w-full">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-[#ededed] tracking-tighter">
            The Operating System for <br />
            <span className="text-green-500">Technical Hiring</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-[700px] mx-auto leading-relaxed">
            Assess, interview, and hire top developers with the most advanced coding platform.
            Used by leading engineering teams worldwide.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <SignUpButton mode="modal">
              <button className="bg-green-500 text-black px-8 py-3.5 rounded font-semibold text-base border-none cursor-pointer transition-colors hover:bg-green-600">
                Start Hiring
              </button>
            </SignUpButton>
            <Link href="/ResumeUpload" className="bg-transparent text-[#ededed] px-8 py-3.5 rounded font-semibold text-base border border-white/20 cursor-pointer transition-colors hover:border-[#ededed] hover:bg-white/5 no-underline flex items-center justify-center">
              upload resume
            </Link>
          </div>
        </div>
      </main>

      {/* Value Proposition / Features */}
      <section className="py-24 px-8 bg-[#0a0a0a] max-w-[1200px] mx-auto w-full">
        <h2 className="text-3xl font-semibold mb-4 text-center">
          Why Devforces?
        </h2>
        <p className="text-center text-zinc-400 mb-16 text-lg">
          Built for scale, security, and developer experience.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            title="Standardized Assessments" 
            text="Create consistent, unbiased technical assessments that predict job performance. Validated by thousands of hires."
            icon={<AssessmentIcon />}
          />
          <FeatureCard 
            title="Real-World Environment" 
            text="A fully configured IDE that supports 40+ languages, frameworks, and tools. Developers feel right at home."
            icon={<TerminalIcon />}
          />
          <FeatureCard 
            title="Actionable Insights" 
            text="Go beyond pass/fail. Get deep insights into candidate code quality, efficiency, and problem-solving patterns."
            icon={<ChartIcon />}
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#171717] py-24 px-8 text-center border-t border-white/10">
        <h2 className="text-4xl font-bold mb-6">Ready to transform your hiring?</h2>
        <p className="text-zinc-400 mb-10 text-xl max-w-[600px] mx-auto">
          Join thousands of companies building better teams with Devforces.
        </p>
        <SignUpButton mode="modal">
          <button className="bg-green-500 text-black px-8 py-3.5 rounded font-semibold text-base border-none cursor-pointer transition-colors hover:bg-green-600">
            Get Started for Free
          </button>
        </SignUpButton>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-8 border-t border-white/10 text-sm text-neutral-500">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            &copy; {new Date().getFullYear()} Devforces Inc. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-zinc-400 transition-colors hover:text-white no-underline">Privacy</Link>
            <Link href="/terms" className="text-zinc-400 transition-colors hover:text-white no-underline">Terms</Link>
            <Link href="/contact" className="text-zinc-400 transition-colors hover:text-white no-underline">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#171717] border border-white/10 rounded-lg p-8 transition-all hover:border-green-500 hover:-translate-y-0.5">
      <div className="w-12 h-12 flex items-center justify-center bg-green-500/10 rounded-md text-green-500 mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-4 text-[#ededed]">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-base">{text}</p>
    </div>
  );
}

// Professional Icons
function AssessmentIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}
