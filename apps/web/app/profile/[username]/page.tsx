"use client";

import { useParams } from "next/navigation";
import { useProfile } from "@/lib/userProfile";
import { PlatformHeatmap } from "@/components/PlatformHeatmap";
import { WakatimeDashboard } from "@/components/WakatimeDashboard";

export default function ProfilePage() {
  const { username } = useParams();
  const { profile, loading } = useProfile();

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500">Profile not found</div>;
  }

  const getGhHandle = (url?: string) => url?.split("github.com/")[1]?.split("/")[0] || "";
  const getLcHandle = (url?: string) => url?.split("leetcode.com/u/")[1]?.split("/")[0] || url?.split("leetcode.com/")[1]?.split("/")[0] || "";
  const getCfHandle = (url?: string) => url?.split("codeforces.com/profile/")[1]?.split("/")[0] || "";
  const getWakatimeHandle = (val?: string) => {
    if (!val) return "";
    if (val.includes("wakatime.com/@")) {
      return val.split("wakatime.com/@")[1]?.split("/")?.[0]?.split("?")?.[0] || "";
    }
    return val;
  };

  const ghHandle = getGhHandle(profile.user?.gh_url);
  const lcHandle = getLcHandle(profile.user?.lc_url);
  const cfHandle = getCfHandle(profile.user?.cf_url);
  const wakatimeHandle = getWakatimeHandle(profile.user?.wakatime_api);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.05),transparent_50%)]">
      <div className="max-w-5xl mx-auto space-y-8">

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
                <a href={profile.user?.gh_url} target="_blank" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  GitHub
                </a>
              )}
              {lcHandle && (
                <a href={profile.user?.lc_url} target="_blank" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.536-.536.554-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.536-1.387-.554-1.902-.039l-7.078 7.18c-.81.812-1.227 1.9-1.227 3.004s.418 2.221 1.227 3.022l7.105 7.061a4.54 4.54 0 0 0 3.128 1.469 4.537 4.537 0 0 0 3.129-1.469l2.608-2.636c.515-.514.498-1.366-.037-1.901-.536-.535-1.387-.553-1.902-.038zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/></svg>
                  LeetCode
                </a>
              )}
              {cfHandle && (
                <a href={profile.user?.cf_url} target="_blank" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-xs font-bold text-white transition-all shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm-4.5 3c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-7.5c0-.828.672-1.5 1.5-1.5zm9-6c.828 0 1.5.672 1.5 1.5v13.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V6c0-.828.672-1.5 1.5-1.5z" fill="#1F8ACB"/></svg>
                  Codeforces
                </a>
              )}
              {wakatimeHandle && (
                <a href={`https://wakatime.com/@${wakatimeHandle}`} target="_blank" className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-full text-xs font-bold text-zinc-300 transition-all shadow-lg flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#38b259]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.996 0c.264 0 .524.032.775.093l.3.082V2.83c-.352-.1-.715-.152-1.075-.152-2.825 0-5.115 2.29-5.115 5.115 0 2.22 1.418 4.15 3.473 4.86.326.112.51.464.425.795a.614.614 0 01-.768.42C7.307 12.986 5.483 10.512 5.483 7.794c0-3.593 2.92-6.513 6.513-6.513M22.062 13.924c.756.9 1.155 2.023 1.155 3.24 0 2.825-2.29 5.114-5.114 5.114a5.08 5.08 0 01-3.618-1.5 5.083 5.083 0 01-1.498-3.616c0-.582.095-1.155.283-1.688.106-.307.437-.47.746-.364.305.105.474.437.368.746-.145.42-.22.868-.22 1.306 0 2.124 1.72 3.846 3.844 3.846 2.124 0 3.844-1.722 3.844-3.846 0-.9-.304-1.72-.857-2.38a.625.625 0 01.073-.883.628.628 0 01.884.072zM12.9 8.017a.628.628 0 01-.628.628H8.85l7.103 7.104c-.382.493-.842.92-1.353 1.258a.627.627 0 11-.692-1.042 5.093 5.093 0 001.033-.94L7.846 7.925v.092a.628.628 0 11-1.257 0v-2.02c0-.348.28-.628.628-.628h2.02a.628.628 0 110 1.256H9.15l4.378 4.378h-.615a.628.628 0 110 1.256h.615l-.624-.624v.624a.628.628 0 11-1.256 0v-2.012H9.088c-.347 0-.628-.28-.628-.628V7.61c0-.346.28-.628.628-.628h3.184c.346 0 .628.28.628.628v.406z"/></svg>
                  WakaTime
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <h2 className="text-2xl font-bold text-white px-2 border-l-4 border-green-500 flex items-center gap-3">
            Developer Stats
            <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded-md text-zinc-400 border border-white/5">Live Data</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {ghHandle && (
              <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-2xl p-6 lg:p-10 flex flex-col items-center transition-colors">
                <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-3 text-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                  Activity Graph
                </h3>
                <div className="w-full overflow-x-auto pb-4 pt-2 flex justify-center scrollbar-hide">
                  <img src={`https://ghchart.rshah.org/06402B/${ghHandle}`} alt="Github Heatmap" className="w-full max-w-4xl min-w-[700px] saturate-150 drop-shadow-md transition-all duration-300 contrast-125" />
                </div>
              </div>
            )}

            {lcHandle && (
              <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-2xl p-6 lg:p-10 shadow-xl flex flex-col items-center transition-colors group overflow-hidden">
                <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-2 text-lg">
                  <svg className="w-5 h-5 text-yellow-500 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.536-.536.554-1.387.039-1.901l-2.609-2.636a5.055 5.055 0 0 0-2.445-1.337l2.467-2.503c.516-.514.498-1.366-.037-1.901-.535-.536-1.387-.554-1.902-.039l-7.078 7.18c-.81.812-1.227 1.9-1.227 3.004s.418 2.221 1.227 3.022l7.105 7.061a4.54 4.54 0 0 0 3.128 1.469 4.537 4.537 0 0 0 3.129-1.469l2.608-2.636c.515-.514.498-1.366-.037-1.901-.536-.535-1.387-.553-1.902-.038zM20.811 13.01H10.666c-.702 0-1.27.604-1.27 1.346s.568 1.346 1.27 1.346h10.145c.701 0 1.27-.604 1.27-1.346s-.569-1.346-1.27-1.346z"/></svg>
                  LeetCode
                </h3>
                <div className="flex flex-col items-center w-full gap-8">
                  <img
                    src={`https://leetcard.jacoblin.cool/${lcHandle}?theme=dark`}
                    alt="LeetCode Stats"
                    className="w-full max-w-[400px] rounded-xl"
                  />
                  <div className="w-full bg-black/40 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-zinc-400 text-sm font-medium mb-4 text-center">Submission Heatmap</h4>
                    <PlatformHeatmap platform="leetcode" username={lcHandle} />
                  </div>
                </div>
              </div>
            )}

            {cfHandle && (
              <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-2xl p-6 lg:p-10 shadow-xl flex flex-col items-center transition-colors group overflow-hidden">
                <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-2 text-lg">
                  <svg className="w-5 h-5 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor"><path d="M4.5 7.5C5.328 7.5 6 8.172 6 9v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm9 0c.828 0 1.5.672 1.5 1.5v10.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V9c0-.828.672-1.5 1.5-1.5zm-4.5 3c.828 0 1.5.672 1.5 1.5v7.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5v-7.5c0-.828.672-1.5 1.5-1.5zm9-6c.828 0 1.5.672 1.5 1.5v13.5c0 .828-.672 1.5-1.5 1.5s-1.5-.672-1.5-1.5V6c0-.828.672-1.5 1.5-1.5z" fill="#1F8ACB"/></svg>
                  Codeforces
                </h3>
                <div className="flex flex-col items-center w-full gap-8">
                  <img
                    src={`https://codeforces-readme-stats.vercel.app/api/card?username=${cfHandle}&theme=tokyonight&disable_animations=false`}
                    alt="Codeforces Stats"
                    className="w-full max-w-[400px] rounded-xl"
                  />
                  <div className="w-full bg-black/40 p-6 rounded-2xl border border-white/5">
                    <h4 className="text-zinc-400 text-sm font-medium mb-4 text-center">Submission Heatmap</h4>
                    <PlatformHeatmap platform="codeforces" username={cfHandle} />
                  </div>
                </div>
              </div>
            )}

            {wakatimeHandle && (
              <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-zinc-900/50 to-black border border-white/10 rounded-2xl p-6 lg:p-8 shadow-xl flex flex-col items-center transition-colors group overflow-hidden">
                <h3 className="text-zinc-200 font-semibold mb-6 flex items-center gap-2 text-lg">
                  <svg className="w-5 h-5 text-[#38b259]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.996 0c.264 0 .524.032.775.093l.3.082V2.83c-.352-.1-.715-.152-1.075-.152-2.825 0-5.115 2.29-5.115 5.115 0 2.22 1.418 4.15 3.473 4.86.326.112.51.464.425.795a.614.614 0 01-.768.42C7.307 12.986 5.483 10.512 5.483 7.794c0-3.593 2.92-6.513 6.513-6.513M22.062 13.924c.756.9 1.155 2.023 1.155 3.24 0 2.825-2.29 5.114-5.114 5.114a5.08 5.08 0 01-3.618-1.5 5.083 5.083 0 01-1.498-3.616c0-.582.095-1.155.283-1.688.106-.307.437-.47.746-.364.305.105.474.437.368.746-.145.42-.22.868-.22 1.306 0 2.124 1.72 3.846 3.844 3.846 2.124 0 3.844-1.722 3.844-3.846 0-.9-.304-1.72-.857-2.38a.625.625 0 01.073-.883.628.628 0 01.884.072zM12.9 8.017a.628.628 0 01-.628.628H8.85l7.103 7.104c-.382.493-.842.92-1.353 1.258a.627.627 0 11-.692-1.042 5.093 5.093 0 001.033-.94L7.846 7.925v.092a.628.628 0 11-1.257 0v-2.02c0-.348.28-.628.628-.628h2.02a.628.628 0 110 1.256H9.15l4.378 4.378h-.615a.628.628 0 110 1.256h.615l-.624-.624v.624a.628.628 0 11-1.256 0v-2.012H9.088c-.347 0-.628-.28-.628-.628V7.61c0-.346.28-.628.628-.628h3.184c.346 0 .628.28.628.628v.406z"/></svg>
                  WakaTime
                </h3>
                <div className="flex flex-col items-center justify-center w-full">
                  <WakatimeDashboard apiKey={profile.user?.wakatime_api || ""} />
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
