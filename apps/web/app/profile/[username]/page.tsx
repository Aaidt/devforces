"use client";

import { useParams } from "next/navigation";
import { useProfile } from "@/lib/userProfile";

export default function ProfilePage() {
  const { username } = useParams();
  const { profile, loading } = useProfile();

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500">Profile not found</div>;
  }

  // Parse out handles from URLs
  const getGhHandle = (url?: string) => url?.split("github.com/")[1]?.split("/")[0] || "";
  const getLcHandle = (url?: string) => url?.split("leetcode.com/u/")[1]?.split("/")[0] || url?.split("leetcode.com/")[1]?.split("/")[0] || "";
  const getCfHandle = (url?: string) => url?.split("codeforces.com/profile/")[1]?.split("/")[0] || "";

  const ghHandle = getGhHandle(profile.user.gh_url);
  const lcHandle = getLcHandle(profile.user.lc_url);
  const cfHandle = getCfHandle(profile.user.cf_url);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.05),transparent_50%)]">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profile Section */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left transition-all hover:border-white/20">
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-zinc-800 shadow-2xl shadow-green-500/10">
            {profile.profile_pic_url ? (
              <img src={profile.profile_pic_url} alt={profile.first_name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-5xl font-bold uppercase">
                {profile.first_name?.[0]}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4 pt-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{profile.first_name} {profile.user.last_name}</h1>
              <p className="text-green-500 font-semibold tracking-wide mt-1.5 flex items-center justify-center md:justify-start gap-1">
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                {username}
              </p>
            </div>
            {profile.user.bio && (
              <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl bg-white/5 p-4 rounded-xl border border-white/5">
                {profile.user.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
              {ghHandle && (
                <a href={profile.user.gh_url} target="_blank" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
              )}
              {lcHandle && (
                <a href={profile.user.lc_url} target="_blank" className="px-5 py-2.5 bg-yellow-900/40 hover:bg-yellow-900/60 border border-yellow-500/20 rounded-full text-xs font-bold text-yellow-500 transition-all shadow-lg">
                  LeetCode
                </a>
              )}
              {cfHandle && (
                <a href={profile.user.cf_url} target="_blank" className="px-5 py-2.5 bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/20 rounded-full text-xs font-bold text-blue-400 transition-all shadow-lg">
                  Codeforces
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-white px-2 border-l-4 border-green-500 flex items-center gap-3">
            Developer Stats 
            <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded-md text-zinc-400 border border-white/5">Live Data</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* GitHub Contributions Heatmap */}
            {ghHandle && (
              <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-3xl p-6 lg:p-10 flex flex-col items-center shadow-xl hover:border-white/20 transition-colors">
                <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-3 text-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  Activity Graph
                </h3>
                <div className="w-full overflow-x-auto pb-4 pt-2 flex justify-center scrollbar-hide">
                  <img src={`https://ghchart.rshah.org/22c55e/${ghHandle}`} alt="Github Heatmap" className="w-full max-w-4xl min-w-[700px] hover:saturate-200 drop-shadow-lg transition-all duration-300 contrast-125" />
                </div>
              </div>
            )}

            {/* LeetCode Stats */}
            {lcHandle && (
              <div className="bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col items-center hover:border-yellow-500/30 transition-colors group">
                <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-2">
                  <span className="text-yellow-500 font-bold bg-yellow-500/10 px-2 py-1 rounded w-8 h-8 flex items-center justify-center">L</span> LeetCode
                </h3>
                <img 
                  src={`https://leetcard.jacoblin.cool/${lcHandle}?theme=dark&font=Inter&ext=activity`} 
                  alt="LeetCode Stats" 
                  className="w-full max-w-[400px] rounded-2xl shadow-2xl group-hover:scale-[1.02] transform transition-transform duration-300 border border-white/5"
                />
              </div>
            )}

            {/* Codeforces Stats */}
            {cfHandle && (
              <div className="bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col items-center hover:border-blue-500/30 transition-colors group">
                <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-2">
                  <span className="text-blue-500 font-bold bg-blue-500/10 px-2 py-1 rounded w-8 h-8 flex items-center justify-center">CF</span> Codeforces
                </h3>
                <img 
                  src={`https://codeforces-readme-stats.vercel.app/api/card?username=${cfHandle}&theme=tokyonight&disable_animations=false`} 
                  alt="Codeforces Stats" 
                  className="w-full max-w-[400px] rounded-2xl shadow-2xl group-hover:scale-[1.02] transform transition-transform duration-300 border border-white/5"
                />
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
