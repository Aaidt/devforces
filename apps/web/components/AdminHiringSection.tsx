"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

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

export function AdminHiringSection() {
  const { getToken, isLoaded, userId } = useAuth();

  const [existingPosts, setExistingPosts] = useState<HiringPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

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

  return (
    <div className="space-y-6 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white px-2 border-l-4 border-emerald-500 flex items-center gap-3">
          Hiring Dashboard
        </h2>
        <Link
          href="/hiring/post"
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition-colors"
        >
          Create new opening
        </Link>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white/90 border-b border-white/5 pb-2 flex items-center gap-3">
          Your Hiring Posts
          {!loadingPosts && (
            <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded-md text-zinc-400 border border-white/5">
              {existingPosts.length}
            </span>
          )}
        </h3>

        {loadingPosts ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin"></div>
          </div>
        ) : existingPosts.length === 0 ? (
          <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-16 text-center">
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
              No hiring posts yet. Click "Create new opening" to post your first
              opening.
            </p>
          </div>
        ) : (
          existingPosts.map((post) => (
            <div
              key={post.id}
              className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-base font-semibold text-white truncate">
                      {post.job_title}
                    </h4>
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
                          {new Date(post.contest.deadline).toLocaleDateString()}
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
  );
}
