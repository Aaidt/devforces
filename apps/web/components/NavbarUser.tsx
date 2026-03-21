"use client";

import { useUser, useClerk, UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";

export function NavbarUser() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const { signOut, openUserProfile } = useClerk();
  const router = useRouter();
  
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "onboarded" | "not_onboarded">("loading");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchMe() {
      if (!isLoaded) return;
      if (!isSignedIn) {
        setStatus("not_onboarded");
        return;
      }

      try {
        const token = await getToken();
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.firstName && res.data.profilePicUrl) {
          setUsername(res.data.firstName);
          setProfilePic(res.data.profilePicUrl);
          setStatus("onboarded");
        } else {
          setStatus("not_onboarded");
        }
      } catch (err) {
        console.error(err);
        setStatus("not_onboarded");
      }
    }
    fetchMe();
  }, [isLoaded, isSignedIn, user, getToken]);

  if (!isLoaded || !isSignedIn) return null;

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 animate-pulse" />;
  }

  if (status === "onboarded" && profilePic && username) {
    return (
      <div className="relative">
        <button 
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-8 h-8 rounded-full md:w-9 md:h-9 overflow-hidden border border-white/10 hover:border-green-500/50 transition cursor-pointer"
        >
          <img src={profilePic} alt={username} className="w-full h-full object-cover" />
        </button>

        {dropdownOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
            <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              
              <div className="px-4 py-3 flex items-center gap-3 border-b border-white/5 mb-1">
                <img src={profilePic} alt={username} className="w-10 h-10 rounded-full object-cover bg-zinc-800" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white capitalize">{username}</span>
                  <span className="text-xs text-white/50 truncate max-w-[120px]">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
              </div>

              <Link 
                href={`/profile/${username.toLowerCase()}`}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 mx-1.5 rounded-xl hover:bg-white/5 transition text-sm text-zinc-300 hover:text-white cursor-pointer"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
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
          </>
        )}
      </div>
    );
  }

  return (
    <UserButton
      appearance={{
        elements: {
          userButtonAvatarBox: "w-8 h-8 rounded-full border border-white/10"
        }
      }}
    />
  );
}
