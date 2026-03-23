"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

interface Challenge {
  id: string;
  title: string;
  max_pts: number;
  challenge_doc: string;
  question_type: string;
  difficulty: string;
}

interface ContestDetail {
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
    company_description: string | null;
    company_website: string | null;
  } | null;
  contest_to_challenge_mapping: {
    id: string;
    position: number;
    challenge: Challenge;
  }[];
}

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params.contestId as string;
  const { getToken, isLoaded, userId } = useAuth();
  const [contest, setContest] = useState<ContestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );

  useEffect(() => {
    if (!isLoaded || !userId || !contestId) return;
    fetchContest();
  }, [isLoaded, userId, contestId]);

  const fetchContest = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `http://localhost:3000/v1/user/contests/${contestId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setContest(data.contest);
      if (data.contest.contest_to_challenge_mapping?.length > 0) {
        setSelectedChallenge(
          data.contest.contest_to_challenge_mapping[0].challenge,
        );
      }
    } catch (err) {
      console.error("Failed to fetch contest:", err);
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

  const getContestStatus = () => {
    if (!contest) return "unknown";
    const now = new Date();
    const start = new Date(contest.start_time);
    const deadline = new Date(contest.deadline);

    if (now < start) return "upcoming";
    if (now >= start && now <= deadline) return "active";
    return "ended";
  };

  if (loading) {
    return (
      <div className="flex bg-[#0a0a0a] min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-28 pb-16 px-4 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Contest not found</h1>
        </div>
      </div>
    );
  }

  const status = getContestStatus();

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial_gradient(ellipse_at_top_right,rgba(34,197,94,0.05),transparent_50%)] pt-28 pb-16 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{contest.title}</h1>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${
                    status === "active"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : status === "upcoming"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                  }`}
                >
                  {status === "active"
                    ? "Active"
                    : status === "upcoming"
                      ? "Upcoming"
                      : "Ended"}
                </span>
              </div>

              {contest.hiring_post && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-emerald-400 mb-2">
                    {contest.hiring_post.job_title}
                  </h2>
                  <p className="text-white/60 text-sm mb-3">
                    {contest.hiring_post.job_description}
                  </p>
                  <div className="bg-zinc-900/50 rounded-lg p-4 border border-white/5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Requirements
                    </h3>
                    <p className="text-white/60 text-sm">
                      {contest.hiring_post.requirements}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-zinc-500">
                <span>Start: {formatDate(contest.start_time)}</span>
                <span className="text-zinc-700">•</span>
                <span>Deadline: {formatDate(contest.deadline)}</span>
              </div>
            </div>

            {selectedChallenge && (
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    {selectedChallenge.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded border ${
                        selectedChallenge.difficulty === "easy"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : selectedChallenge.difficulty === "medium"
                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {selectedChallenge.difficulty}
                    </span>
                    <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded border border-white/10">
                      {selectedChallenge.max_pts} pts
                    </span>
                  </div>
                </div>

                <div className="prose prose-invert max-w-none">
                  <div className="text-white/80 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedChallenge.challenge_doc}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Question Type:{" "}
                    {selectedChallenge.question_type.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Problems</h3>
              <div className="space-y-2">
                {contest.contest_to_challenge_mapping?.map((mapping, index) => (
                  <button
                    key={mapping.id}
                    onClick={() => setSelectedChallenge(mapping.challenge)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedChallenge?.id === mapping.challenge.id
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 text-xs">
                        {index + 1}
                      </span>
                      <span className="text-sm truncate">
                        {mapping.challenge.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-8 text-xs text-zinc-500">
                      <span>
                        {mapping.challenge.question_type.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span>{mapping.challenge.difficulty}</span>
                      <span>•</span>
                      <span>{mapping.challenge.max_pts}pts</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {contest.admin && (
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">
                  About the Company
                </h3>
                <div className="space-y-3">
                  {contest.admin.company_name && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Company
                      </span>
                      <p className="text-white/80 text-sm">
                        {contest.admin.company_name}
                      </p>
                    </div>
                  )}
                  {contest.admin.company_description && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Description
                      </span>
                      <p className="text-white/60 text-sm">
                        {contest.admin.company_description}
                      </p>
                    </div>
                  )}
                  {contest.admin.company_website && (
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Website
                      </span>
                      <a
                        href={contest.admin.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 text-sm hover:underline"
                      >
                        {contest.admin.company_website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
