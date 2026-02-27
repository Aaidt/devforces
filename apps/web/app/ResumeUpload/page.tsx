"use client"

import axios from "axios";
import { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { isLoaded, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setSuccess(false);

    const token = await getToken({ template: "backend" });

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/upload_url`,
      { filename: file.name },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const { url } = res.data;

    const response = await axios.put(url, file, {
      headers: { "Content-Type": "application/pdf" }
    });

    if (response.status === 200) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/confirm`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    }

    setUploading(false);
  }

  async function  handleDownload() {
    const token = await getToken({ template: "backend" });

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/`,
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-zinc-900 via-black to-black px-4 overflow-hidden">
      <div className="w-full max-w-xl bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">

        <header className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Upload Your Resume</h1>
          <p className="text-zinc-500 text-xs mt-1">PDF files only (Max 5MB)</p>
        </header>

        <div className="space-y-6">

          <form onSubmit={handleSubmit} className="space-y-4">
            <label
              htmlFor="fileInput"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 bg-white/2 rounded-xl cursor-pointer hover:border-zinc-400 hover:bg-white/5 transition-all group"
            >
              <div className="flex flex-col items-center justify-center py-4">
                <svg className="w-6 h-6 mb-2 text-zinc-500 group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm text-zinc-300 font-medium px-4 text-center truncate w-full max-w-[300px]">
                  {file ? file.name : "Click to select PDF"}
                </p>
              </div>
              <input id="fileInput" type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full bg-white cursor-pointer text-black py-3 rounded-xl font-bold text-sm transition-all disabled:bg-zinc-800 disabled:text-zinc-500"
            >
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </form>

          {success && (
            <div className="pt-6 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-500">
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleDownload} 
                  className="px-3 cursor-pointer py-2.5 bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 rounded-lg text-xs font-semibold text-white transition flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview Resume
                </button>
                <button 
                  onClick={() => router.push("/CandidateDetails")} 
                  className="px-3 cursor-pointer py-2.5 bg-white hover:bg-zinc-100 border border-white/5 rounded-lg text-xs font-semibold text-black transition flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  Next: Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}