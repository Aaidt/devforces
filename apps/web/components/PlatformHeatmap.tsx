"use client";

import { useEffect, useState } from "react";

type ActivityMap = { [timestamp: string]: number };

export function PlatformHeatmap({ platform, username }: { platform: "leetcode" | "codeforces", username: string }) {
  const [data, setData] = useState<ActivityMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!username) return;

    if (platform === "leetcode") {
      fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)
        .then((res) => res.json())
        .then((data) => {
          if (data.submissionCalendar) {
            setData(JSON.parse(data.submissionCalendar));
          }
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    } else if (platform === "codeforces") {
      fetch(`https://codeforces.com/api/user.status?handle=${username}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.status === "OK") {
            const map: ActivityMap = {};
            res.result.forEach((sub: any) => {
              const dayStamp = Math.floor(sub.creationTimeSeconds / 86400) * 86400;
              map[dayStamp] = (map[dayStamp] || 0) + 1;
            });
            setData(map);
          } else {
            setError(true);
          }
          setLoading(false);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }
  }, [platform, username]);

  if (loading) return <div className="h-32 text-zinc-500 flex items-center justify-center animate-pulse text-sm">Fetching {platform} activity...</div>;
  if (error) return <div className="h-32 text-red-500/50 flex items-center justify-center text-sm">Failed to load {platform} data.</div>;

  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const oneYearAgo = new Date(today.getTime() - 364 * 24 * 60 * 60 * 1000);
  oneYearAgo.setHours(0, 0, 0, 0);

  const days: { date: Date, count: number }[] = [];
  
  const activityByDateId: Record<string, number> = {};
  Object.keys(data).forEach(timestamp => {
    const d = new Date(parseInt(timestamp) * 1000);
    const dateId = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    activityByDateId[dateId] = (activityByDateId[dateId] || 0) + data[timestamp];
  });

  for (let i = 0; i <= 365; i++) {
    const iterDate = new Date(oneYearAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const dateId = `${iterDate.getFullYear()}-${iterDate.getMonth()}-${iterDate.getDate()}`;
    days.push({
      date: iterDate,
      count: activityByDateId[dateId] || 0,
    });
  }

  const columns: { date: Date, count: number }[][] = [];
  let currentColumn: { date: Date, count: number }[] = [];
  
  for(let i = 0; i < (days[0]?.date.getDay() || 0); i++) {
     currentColumn.push({ date: new Date(0), count: -1 }); 
  }

  days.forEach((day, index) => {
    currentColumn.push(day);
    if (currentColumn.length === 7 || index === days.length - 1) {
      columns.push(currentColumn);
      currentColumn = [];
    }
  });

  if (currentColumn.length > 0) {
    while(currentColumn.length < 7) currentColumn.push({ date: new Date(0), count: -1 });
    columns.push(currentColumn);
  }

  const getColorClass = (count: number) => {
    if (count < 0) return "bg-transparent opacity-0 pointer-events-none"; 
    if (count === 0) return "bg-zinc-800/80";
    
    if (platform === "leetcode") {
      if (count === 1) return "bg-yellow-600/50";
      if (count <= 3) return "bg-yellow-500/80";
      if (count <= 5) return "bg-yellow-400";
      return "bg-yellow-300 shadow-[0_0_6px_rgba(250,204,21,0.6)] z-10 relative";
    } else {
      if (count === 1) return "bg-blue-600/50";
      if (count <= 3) return "bg-blue-500/80";
      if (count <= 5) return "bg-blue-400";
      return "bg-blue-300 shadow-[0_0_6px_rgba(96,165,250,0.6)] z-10 relative";
    }
  };

  return (
    <div className="w-full flex justify-center py-2 overflow-hidden">
      <div className="flex gap-[3px] items-start">
        {columns.map((col, cIdx) => (
          <div key={cIdx} className="flex flex-col gap-[3px] hover:-translate-y-1 transition-transform duration-300">
            {col.map((day, dIdx) => (
              <div
                key={dIdx}
                className={`w-[10px] h-[10px] rounded-[2px] ${getColorClass(day.count)} transition-all hover:scale-150 origin-center`}
                title={day.count >= 0 ? `${day.count} submissions on ${day.date.toDateString()}` : undefined}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
