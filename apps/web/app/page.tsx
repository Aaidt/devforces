import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            The Operating System for <br />
            <span className={styles.titleHighlight}>Technical Hiring</span>
          </h1>
          <p className={styles.subtitle}>
            Assess, interview, and hire top developers with the most advanced coding platform.
            Used by leading engineering teams worldwide.
          </p>
          <div className={styles.ctaGroup}>
            <SignUpButton mode="modal">
              <button className={styles.primaryButton}>
                Start Hiring
              </button>
            </SignUpButton>
            <Link href="/challenges" className={styles.secondaryButton}>
              Take a Challenge
            </Link>
          </div>
        </div>
      </main>

      {/* Value Proposition / Features */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>
          Why Devforces?
        </h2>
        <p className={styles.sectionSubtitle}>
          Built for scale, security, and developer experience.
        </p>
        
        <div className={styles.grid}>
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
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to transform your hiring?</h2>
        <p className={styles.ctaText}>
          Join thousands of companies building better teams with Devforces.
        </p>
        <SignUpButton mode="modal">
          <button className={styles.primaryButton}>
            Get Started for Free
          </button>
        </SignUpButton>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            &copy; {new Date().getFullYear()} Devforces Inc. All rights reserved.
          </div>
          <div className={styles.footerLinks}>
            <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
            <Link href="/terms" className={styles.footerLink}>Terms</Link>
            <Link href="/contact" className={styles.footerLink}>Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, text, icon }: { title: string; text: string; icon: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardText}>{text}</p>
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
