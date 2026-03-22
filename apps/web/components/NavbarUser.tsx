"use client";

import { useUser, useClerk, UserButton } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, Briefcase } from "lucide-react";
import { useProfile } from "@/lib/userProfile";

export function NavbarUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  const { profile, loading } = useProfile();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  if (!isLoaded || !isSignedIn) return null;

  if (loading) {
    return <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 animate-pulse" />;
  }

  const profilePic = profile?.profile_pic_url;
  const username = profile?.first_name;
  const isAdmin = profile?.user?.role === "admin";

  if (profilePic && username) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-8 h-8 rounded-full md:w-9 md:h-9 overflow-hidden border border-white/10 hover:border-green-500/50 transition cursor-pointer flex items-center justify-center"
        >
          <img src={profilePic} alt={username} className="w-full h-full object-cover" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-3 w-60 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">

            <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5 mb-1">
              <img src={profilePic} alt={username} className="w-10 h-10 rounded-full object-cover bg-zinc-800" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white capitalize">{username}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/50 truncate max-w-[100px]">{user?.primaryEmailAddress?.emailAddress}</span>
                  {isAdmin && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isAdmin ? (
              <>
                <Link
                  href={`/profile/${username.toLowerCase()}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-xl hover:bg-white/5 transition text-sm text-zinc-300 hover:text-white cursor-pointer"
                >
                  <Briefcase className="w-4 h-4" /> Hiring Dashboard
                </Link>
                <Link
                  href="/hiring/post"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-xl hover:bg-white/5 transition text-sm text-zinc-300 hover:text-white cursor-pointer"
                >
                  <User className="w-4 h-4" /> Create Post
                </Link>
              </>
            ) : (
              <Link
                href={`/profile/${username.toLowerCase()}`}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-xl hover:bg-white/5 transition text-sm text-zinc-300 hover:text-white cursor-pointer"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
            )}

            <button
              onClick={() => { setDropdownOpen(false); openUserProfile(); }}
              className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-xl hover:bg-white/5 transition text-sm text-zinc-300 hover:text-white text-left cursor-pointer"
            >
              <Settings className="w-4 h-4" /> Manage Account
            </button>

            <div className="h-px bg-white/5 my-1 mx-2" />

            <button
              onClick={() => { setDropdownOpen(false); signOut(() => router.push("/")); }}
              className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-xl hover:bg-white/5 transition text-sm text-red-400 hover:text-red-500 hover:bg-red-500/10 text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-full border border-white/10" } }} />;

}
