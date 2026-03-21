"use client";

import { useEffect, useState } from "react";

interface WakatimeData {
  human_readable_total: string;
  human_readable_daily_average: string;
  languages: { name: string; percent: number; text: string; color: string }[];
  editors: { name: string; percent: number; text: string; color: string }[];
  operating_systems: { name: string; percent: number; text: string; color: string }[];
}

export function WakatimeDashboard({ apiKey }: { apiKey: string }) {
  const [data, setData] = useState<WakatimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    // Use a unique callback name to prevent race conditions if multiple components rendered
    const callbackName = `wakatimeCallback_${Math.random().toString(36).substring(7)}`;

    (window as any)[callbackName] = (json: any) => {
      if (json && json.data) {
        setData(json.data);
      } else {
        setError(true);
      }
      setLoading(false);
      delete (window as any)[callbackName];
    };

    const script = document.createElement("script");
    // WakaTime's official method to bypass CORS strictly client-side via JSONP
    script.src = `https://wakatime.com/api/v1/users/current/stats/last_30_days?api_key=${apiKey}&callback=${callbackName}`;
    script.async = true;
    script.onerror = () => {
      setError(true);
      setLoading(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if ((window as any)[callbackName]) {
        delete (window as any)[callbackName];
      }
    };
  }, [apiKey]);

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3 text-zinc-500">
          <svg className="w-5 h-5 animate-spin text-[#38b259]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
          </svg>
          Loading WakaTime Stats...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-zinc-500 bg-black/20 rounded-xl border border-white/5">
        Failed to load WakaTime data or invalid API key.
      </div>
    );
  }

  const parseNum = (str: string) => parseFloat(str) || 0;

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center shadow-inner">
          <p className="text-zinc-400 text-sm font-medium mb-1">Total Coding Time (30 Days)</p>
          <p className="text-2xl font-bold text-white tracking-tight">{data.human_readable_total || "0 mins"}</p>
        </div>
        <div className="bg-black/30 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center shadow-inner">
          <p className="text-zinc-400 text-sm font-medium mb-1">Daily Average (30 Days)</p>
          <p className="text-2xl font-bold text-white tracking-tight">{data.human_readable_daily_average || "0 mins"}</p>
        </div>
      </div>

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-zinc-300 font-semibold text-sm flex items-center justify-between">
            Top Languages
            <span className="text-xs font-normal text-zinc-500">Based on time spent</span>
          </h4>
          <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden flex group">
            {data.languages.slice(0, 8).map((lang, idx) => (
              <div
                key={idx}
                style={{ width: `${lang.percent}%`, backgroundColor: lang.color || "#38b259" }}
                className="h-full transition-all hover:opacity-80"
                title={`${lang.name}: ${lang.text} (${lang.percent}%)`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {data.languages.slice(0, 8).map((lang, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: lang.color || "#38b259" }} />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-zinc-300">{lang.name}</span>
                  <span className="text-[10px] text-zinc-500">{lang.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Editors */}
        {data.editors?.length > 0 && (
          <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
            <h4 className="text-zinc-400 font-medium text-xs uppercase tracking-widest text-center mb-4">Editors</h4>
            <div className="space-y-3">
              {data.editors.slice(0, 5).map((editor, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">{editor.name}</span>
                    <span className="text-zinc-500">{editor.percent}%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${editor.percent}%`, backgroundColor: editor.color || "#60a5fa" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Operating Systems */}
        {data.operating_systems?.length > 0 && (
          <div className="space-y-3 bg-black/20 p-5 rounded-2xl border border-white/5">
            <h4 className="text-zinc-400 font-medium text-xs uppercase tracking-widest text-center mb-4">Operating Systems</h4>
            <div className="space-y-3">
              {data.operating_systems.slice(0, 5).map((os, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300">{os.name}</span>
                    <span className="text-zinc-500">{os.percent}%</span>
                  </div>
                  <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${os.percent}%`, backgroundColor: os.color || "#a78bfa" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
