"use client"

import axios from "axios";
import { useState, useEffect } from "react"
import { useUser, useAuth } from "@clerk/nextjs"
import { redirect, useRouter } from "next/navigation";

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
            {
                filename: file.name,
                content_type: file.type
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const { url } = res.data;

        const response = await axios.put(url, file, {
            headers: { "Content-Type": file.type }
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

    async function handleDownload() {
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
        <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-zinc-900 via-black to-black px-4 py-20">
            <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                <header className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        Upload Your Resume
                    </h1>
                    <p className="text-zinc-400 text-sm">Provide your professional document to proceed with your application.</p>
                </header>

                <div className="space-y-10">
                    {/* Section: File Upload */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Document selection</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <label
                                htmlFor="fileInput"
                                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 bg-white/2 rounded-2xl cursor-pointer hover:border-zinc-400 hover:bg-white/5 transition-all group"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-sm text-zinc-300 font-medium">
                                        {file ? file.name : "Click to select PDF"}
                                    </p>
                                    <p className="text-xs text-zinc-500 mt-1">PDF files only (Max 5MB)</p>
                                </div>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={uploading || !file}
                                className="w-full group relative overflow-hidden cursor-pointer bg-white text-black py-4 rounded-xl font-bold text-lg transition-all disabled:bg-zinc-700 disabled:text-zinc-400"
                            >
                                <span className="relative z-10">{uploading ? "Uploading..." : "Upload Resume"}</span>
                            </button>
                        </form>
                    </section>

                    {/* Section: Actions */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-px flex-1 bg-white/10" />
                            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Next Steps</span>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={handleDownload}
                                className="px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 rounded-xl text-sm font-semibold text-white transition cursor-pointer text-center"
                            >
                                Preview Resume
                            </button>
                            <button
                                onClick={() => redirect("/CandidateDetails")}
                                className="px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-white/10 rounded-xl text-sm font-semibold text-white transition cursor-pointer text-center"
                            >
                                Proceed to Details
                            </button>
                        </div>
                    </section>

                    {success && (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-emerald-400 text-sm text-center font-medium">
                                Resume uploaded successfully
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}