"use client";

import { useParams } from "next/navigation";
import { useProfile } from "@/lib/userProfile";
import { PlatformHeatmap } from "@/components/PlatformHeatmap";
import { WakatimeDashboard } from "@/components/WakatimeDashboard";
import { AdminHiringSection } from "@/components/AdminHiringSection";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { SiCodeforces, SiLeetcode, SiWakatime } from "react-icons/si"

export default function ProfilePage() {
  const { username } = useParams();
  const { profile, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium tracking-widest text-xs uppercase">
          Syncing Profile
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500 font-medium">
        Profile footprint not found in database.
      </div>
    );
  }

  const isAdmin = profile.role === "recruiter";
  const accentColor = isAdmin ? "emerald" : "blue";

  // Handle Extraction Helpers
  const getGhHandle = (url?: string) =>
    url?.split("github.com/")[1]?.split("/")[0] || "";
  const getLcHandle = (url?: string) =>
    url?.split("leetcode.com/u/")[1]?.split("/")[0] ||
    url?.split("leetcode.com/")[1]?.split("/")[0] ||
    "";
  const getCfHandle = (url?: string) =>
    url?.split("codeforces.com/profile/")[1]?.split("/")[0] || "";
  const getWakatimeHandle = (val?: string) => {
    if (!val) return "";
    return val.includes("wakatime.com/@")
      ? val.split("wakatime.com/@")[1]?.split("/")?.[0]?.split("?")?.[0]
      : val;
  };

  const ghHandle = getGhHandle(profile.user?.gh_url);
  const lcHandle = getLcHandle(profile.user?.lc_url);
  const cfHandle = getCfHandle(profile.user?.cf_url);
  const wakatimeHandle = getWakatimeHandle(profile.user?.wakatime_api);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-[#050505] text-slate-200 selection:bg-emerald-500/30">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* PROFILE HEADER CARD */}
        <div className="bg-zinc-900/20 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
          {/* Avatar Area */}
          <div className="relative">
            <div
              className={`absolute -inset-1 bg-gradient-to-tr rounded-[2.8rem] opacity-25`}
            />
            <div className="relative w-36 h-36 md:w-44 md:h-44 flex-shrink-0 rounded-[2.5rem] overflow-hidden bg-zinc-900 border-2 border-white/10">
              {profile.profile_pic_url ? (
                <img
                  src={profile.profile_pic_url}
                  alt={profile.first_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-5xl font-black italic">
                  {profile.first_name?.[0]}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic">
                  {profile.first_name} {profile.user.last_name}
                </h1>
                <div
                  className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full backdrop-blur-md ${isAdmin ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" : "bg-blue-500/10 text-blue-400 border border-blue-500/30"}`}
                >
                  {isAdmin ? "Verified Recruiter" : "Available Talent"}
                </div>
              </div>
              <p
                className={`font-bold tracking-widest text-xs uppercase flex items-center justify-center md:justify-start gap-2 ${isAdmin ? "text-emerald-500" : "text-blue-500"}`}
              >
                @{profile.user.first_name}
              </p>
            </div>

            {isAdmin ? (
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 space-y-2 max-w-xl">
                <p className="text-emerald-400 font-bold text-base flex items-center gap-2">
                  🏢 {profile.user.company_name}
                </p>
                {profile.user.company_description && (
                  <p className="text-zinc-400 text-sm leading-relaxed italic opacity-80">
                    {profile.user.company_description}
                  </p>
                )}
              </div>
            ) : (
              profile.user.bio && (
                <p className="text-slate-400 text-base leading-relaxed max-w-2xl font-medium italic opacity-90">
                  "{profile.user.bio}"
                </p>
              )
            )}

            {/* Social Quick-Access */}
            {!isAdmin && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {[
                  {
                    id: "gh",
                    handle: ghHandle,
                    label: "GitHub",
                    color: "bg-white/5",
                    icon: <FaGithub />
                  },
                  {
                    id: "lc",
                    handle: lcHandle,
                    label: "LeetCode",
                    color: "bg-yellow-500/5",
                    text: "text-yellow-500",
                    icon: <SiLeetcode />
                  },
                  {
                    id: "cf",
                    handle: cfHandle,
                    label: "Codeforces",
                    color: "bg-orange-500/5",
                    text: "text-orange-500",
                    icon: <SiCodeforces />
                  },
                  {
                    id: 'ln',
                    handle: lcHandle,
                    label: 'LinkedIn',
                    color: 'bg-yellow-500/5',
                    text: 'text-yellow-500',
                    icon: <FaLinkedin />
                  }
                ].map(
                  (social) =>
                    social.handle && (
                      <a
                        key={social.id}
                        href="#"
                        className={`px-5 py-2.5 ${social.color} border border-white/5 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2`}
                      >
                        {social.icon}
                        {social.label}
                      </a>
                    ),
                )}
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        {isAdmin ? (
          <AdminHiringSection />
        ) : (
          <div className="space-y-16">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">
                Developer Intelligence
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* GitHub Activity Card */}
              {ghHandle && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                      GitHub Contributions
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white">
                      <FaGithub />
                    </div>
                  </div>
                  <div className="bg-black/60 rounded-2xl p-4 border border-white/5 overflow-x-auto">
                    <img
                      src={`https://ghchart.rshah.org/05714B/${ghHandle}`}
                      alt="Github Heatmap"
                      className="w-full contrast-200 min-h-[100px]"
                    />
                  </div>
                </div>
              )}

              {/* LeetCode Stats Card */}
              {lcHandle && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                      LeetCode
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                      <SiLeetcode />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-6">
                    <img
                      src={`https://leetcard.jacoblin.cool/${lcHandle}?theme=dark`}
                      className="w-full max-w-[280px] rounded-2xl opacity-90"
                    />
                    <div className="flex-1 w-full space-y-4">
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        Active Velocity
                      </p>
                      <PlatformHeatmap
                        platform="leetcode"
                        username={lcHandle}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Codeforces Card */}
              {cfHandle && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 space-y-6 xl:col-span-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                      Codeforces
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <SiCodeforces />
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <img
                      src={`https://codeforces-readme-stats.vercel.app/api/card?username=${cfHandle}&theme=tokyonight`}
                      className="w-full max-w-[360px] mx-auto rounded-2xl"
                    />
                    <PlatformHeatmap
                      platform="codeforces"
                      username={cfHandle}
                    />
                  </div>
                </div>
              )}

              {/* WakaTime Card */}
              {wakatimeHandle && (
                <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
                      Coding Time Breakdown
                    </h3>
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <SiWakatime />
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-2xl p-4">
                    <WakatimeDashboard
                      apiKey={profile.user?.wakatime_api || ""}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}