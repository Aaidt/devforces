"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";

interface HiringPost {
  id: string;
  job_title: string;
  job_description: string;
  requirements: string;
  is_active: boolean;
  created_at: string;
  contest?: {
    id: string;
    title: string;
    deadline: string;
    start_time: string;
  };
}

export default function AdminHiringProfile() {
  const { getToken, isLoaded, userId } = useAuth();

  const [isHiring, setIsHiring] = useState(false);
  const [existingPosts, setExistingPosts] = useState<HiringPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [form, setForm] = useState({
    jobTitle: "",
    jobDescription: "",
    requirements: "",
    contestTitle: "",
    deadline: "",
    startTime: "",
    questionTypes: [] as string[],
    questionsPerType: 3,
    difficulty: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoaded || !userId) return;
    fetchPosts();
  }, [isLoaded, userId]);

  const fetchPosts = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        "http://localhost:3000/v1/admin/hiring/posts",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setExistingPosts(data.posts || []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoadingPosts(false);
    }
  };

  if (!isLoaded || !userId) {
    return (
      <div className="flex bg-[#0a0a0a] min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "questionsPerType" || name === "difficulty") {
      setForm({ ...form, [name]: parseInt(value) || value });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const toggleQuestionType = (type: string) => {
    const currentTypes = form.questionTypes;
    if (currentTypes.includes(type)) {
      setForm({
        ...form,
        questionTypes: currentTypes.filter((t) => t !== type),
      });
    } else {
      setForm({ ...form, questionTypes: [...currentTypes, type] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication error");

      await axios.post(
        "http://localhost:3000/v1/admin/hiring/post",
        {
          jobTitle: form.jobTitle,
          jobDescription: form.jobDescription,
          requirements: form.requirements,
          contestTitle: form.contestTitle,
          deadline: form.deadline,
          startTime: form.startTime,
          questionConfig: {
            questionTypes: form.questionTypes,
            questionsPerType: form.questionsPerType,
            difficulty: form.difficulty,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Hiring post created and contest launched successfully!");
      setForm({
        jobTitle: "",
        jobDescription: "",
        requirements: "",
        contestTitle: "",
        deadline: "",
        startTime: "",
        questionTypes: [],
        questionsPerType: 3,
        difficulty: "medium",
      });
      setIsHiring(false);
      fetchPosts();
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(ellipse_at_top_right,rgba(34,197,94,0.05),transparent_50%)] pt-28 pb-16 px-4 text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                Hiring Dashboard
              </h1>
              <p className="text-white/40 text-sm mt-1">
                Manage your job posts and create hiring contests.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                {isHiring ? "Creating" : "Idle"}
              </span>
              <button
                onClick={() => {
                  setIsHiring(!isHiring);
                  setError("");
                  setSuccess("");
                }}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer ${isHiring ? "bg-emerald-500" : "bg-zinc-700"}`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${isHiring ? "translate-x-7" : "translate-x-0"}`}
                ></div>
              </button>
            </div>
          </div>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm flex items-center gap-3">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {success}
          </div>
        )}

        {/* Hiring Form */}
        {isHiring && (
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <h2 className="text-xl font-bold text-white mb-1">
              Create Hiring Post
            </h2>
            <p className="text-white/40 text-sm mb-8">
              Fill in the job details. A contest will be automatically created
              for candidates to compete in.
            </p>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="jobTitle"
                  value={form.jobTitle}
                  onChange={handleChange}
                  placeholder="Senior Frontend Engineer"
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="jobDescription"
                  value={form.jobDescription}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the role, responsibilities, team structure, tech stack..."
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                  Candidate Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="requirements"
                  value={form.requirements}
                  onChange={handleChange}
                  rows={4}
                  placeholder="3+ years of React experience, TypeScript proficiency, system design skills..."
                  className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all resize-none"
                />
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Contest Configuration
                </h3>

                <div className="space-y-1.5 mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                    Contest Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    name="contestTitle"
                    value={form.contestTitle}
                    onChange={handleChange}
                    placeholder="Hiring Challenge - Senior Frontend Engineer"
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                      Start Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="datetime-local"
                      name="startTime"
                      value={form.startTime}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                      Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="datetime-local"
                      name="deadline"
                      value={form.deadline}
                      onChange={handleChange}
                      className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    Question Configuration
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1 mb-3 block">
                        Question Types (select at least one)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["mcq", "dsa", "backend", "frontend"].map((type) => (
                          <button
                            type="button"
                            key={type}
                            onClick={() => toggleQuestionType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              form.questionTypes.includes(type)
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : "bg-zinc-900/50 text-zinc-400 border border-white/10 hover:border-white/20"
                            }`}
                          >
                            {type.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                          Questions Per Type
                        </label>
                        <input
                          type="number"
                          name="questionsPerType"
                          value={form.questionsPerType}
                          onChange={handleChange}
                          min={1}
                          max={20}
                          className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                          Difficulty Level
                        </label>
                        <select
                          name="difficulty"
                          value={form.difficulty}
                          onChange={handleChange}
                          className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full cursor-pointer bg-white hover:bg-zinc-100 text-black font-bold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed mt-2 text-sm"
              >
                {loading
                  ? "Creating Hiring Post & Contest..."
                  : "Launch Hiring Contest →"}
              </button>
            </form>
          </div>
        )}

        {/* Existing Posts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90 border-b border-white/5 pb-2 flex items-center gap-3">
              Your Hiring Posts
              {!loadingPosts && (
                <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md text-zinc-400 border border-white/5">
                  {existingPosts.length}
                </span>
              )}
            </h2>
          </div>

          {loadingPosts ? (
            <div className="flex justify-center py-16">
              <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
            </div>
          ) : existingPosts.length === 0 ? (
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
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <p className="text-zinc-500 text-sm">
                No hiring posts yet. Toggle the switch above to create your
                first one.
              </p>
            </div>
          ) : (
            existingPosts.map((post) => (
              <div
                key={post.id}
                className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-white truncate">
                        {post.job_title}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${post.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border border-zinc-700"}`}
                      >
                        {post.is_active ? "Active" : "Closed"}
                      </span>
                    </div>
                    <p className="text-white/40 text-sm line-clamp-2 mb-3">
                      {post.job_description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span>
                        Created {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      {post.contest && (
                        <>
                          <span className="text-zinc-700">•</span>
                          <span className="text-indigo-400/80">
                            Contest: {post.contest.title}
                          </span>
                          <span className="text-zinc-700">•</span>
                          <span>
                            Deadline:{" "}
                            {new Date(
                              post.contest.deadline,
                            ).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}