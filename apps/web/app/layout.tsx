import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Devforces",
  description: "Hire at ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-[#ededed]`}>

          <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
            <header className="
              flex justify-between items-center 
              w-full max-w-5xl h-14 px-6
              bg-zinc-900/40 backdrop-blur-md 
              border border-white/5 rounded-2xl 
              shadow-[0_8px_32px_rgba(0,0,0,0.5)]
            ">

              <Link href="/" className="font-bold text-lg text-green-500 tracking-tighter hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.4)] transition-all">
                Devforces
              </Link>

              <div className="flex gap-5 items-center">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="text-zinc-400 font-medium hover:text-white transition-colors text-xs cursor-pointer">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="
                      bg-white text-black px-4 py-1.5 
                      rounded-full font-bold text-xs 
                      hover:bg-green-500 hover:text-white
                      transition-all active:scale-95
                    ">
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-8 h-8 border border-white/10"
                      }
                    }}
                  />
                </SignedIn>
              </div>
            </header>
          </div>

          <main className="pt-12">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
