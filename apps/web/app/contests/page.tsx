"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface Contest {
  id: string;
  title: string;
  deadline: string;
  start_time: string;
  hiring_post: {
    job_title: string;
    job_description: string;
    requirements: string;
  } | null;
  admin: {
    company_name: string | null;
    profile_pic_key: string | null;
  } | null;
  contest_to_challenge_mapping?: {
    id: string;
    position: number;
    challenge: {
      id: string;
      title: string;
      max_pts: number;
      question_type: string;
      difficulty: string;
    };
  }[];
}

interface ContestsData {
  past: Contest[];
  current: Contest[];
  future: Contest[];
}

export default function ContestsPage() {
  const { getToken, isLoaded, userId } = useAuth();
  const [contests, setContests] = useState<ContestsData>({
    past: [],
    current: [],
    future: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "future" | "past">(
    "current",
  );

  useEffect(() => {
    if (!isLoaded || !userId) return;
    fetchContests();
  }, [isLoaded, userId]);

  const fetchContests = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        "http://localhost:3000/v1/user/contests",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setContests(data);
    } catch (err) {
      console.error("Failed to fetch contests:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || !userId) {
    return (
      <div className="flex bg-[#0a0a0a] min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getContestStatus = (contest: Contest) => {
    const now = new Date();
    const start = new Date(contest.start_time);
    const deadline = new Date(contest.deadline);

    if (now < start) return "upcoming";
    if (now >= start && now <= deadline) return "active";
    return "ended";
  };

  const currentContests = contests.current;
  const upcomingContests = contests.future;
  const pastContests = contests.past;

  const tabContent =
    activeTab === "current"
      ? currentContests
      : activeTab === "future"
        ? upcomingContests
        : pastContests;

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.05),transparent_50%)] pt-28 pb-16 px-4 text-white">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Contests
          </h1>
          <p className="text-white/40 text-sm mt-1">
            View and participate in hiring contests from various companies.
          </p>
        </div>

        <div className="flex gap-2 border-b border-white/10">
          {(["current", "future", "past"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "current" && "Active "}
              {tab === "future" && "Upcoming "}
              {tab === "past" && "Past "}(
              {tab === "current"
                ? currentContests.length
                : tab === "future"
                  ? upcomingContests.length
                  : pastContests.length}
              )
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
          </div>
        ) : tabContent.length === 0 ? (
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-16 text-center">
            <svg
              className="w-12 h-12 text-zinc-700 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <p className="text-zinc-500 text-sm">
              {activeTab === "current" && "No active contests at the moment."}
              {activeTab === "future" && "No upcoming contests scheduled."}
              {activeTab === "past" && "No past contests to show."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tabContent.map((contest) => (
              <div
                key={contest.id}
                className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-white truncate">
                        {contest.title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          getContestStatus(contest) === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : getContestStatus(contest) === "upcoming"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                        }`}
                      >
                        {getContestStatus(contest) === "active"
                          ? "Active"
                          : getContestStatus(contest) === "upcoming"
                            ? "Upcoming"
                            : "Ended"}
                      </span>
                    </div>

                    {contest.hiring_post && (
                      <div className="mb-3">
                        <p className="text-emerald-400 text-sm font-medium">
                          {contest.hiring_post.job_title}
                        </p>
                        <p className="text-white/40 text-sm line-clamp-2 mt-1">
                          {contest.hiring_post.job_description}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      {contest.admin?.company_name && (
                        <>
                          <span>{contest.admin.company_name}</span>
                          <span className="text-zinc-700">•</span>
                        </>
                      )}
                      <span>Starts: {formatDate(contest.start_time)}</span>
                      <span className="text-zinc-700">•</span>
                      <span>Deadline: {formatDate(contest.deadline)}</span>
                    </div>

                    {contest.contest_to_challenge_mapping &&
                      contest.contest_to_challenge_mapping.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {contest.contest_to_challenge_mapping.map(
                            (mapping) => (
                              <span
                                key={mapping.id}
                                className="text-xs px-2 py-1 bg-zinc-800/50 text-zinc-400 rounded border border-white/5"
                              >
                                {mapping.challenge.question_type.toUpperCase()}{" "}
                                • {mapping.challenge.difficulty} •{" "}
                                {mapping.challenge.max_pts}pts
                              </span>
                            ),
                          )}
                        </div>
                      )}
                  </div>

                  {getContestStatus(contest) === "active" && (
                    <Link
                      href={`/contests/${contest.id}`}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Participate
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
