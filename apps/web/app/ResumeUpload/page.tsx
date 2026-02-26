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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 px-4">

            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">

                <h1 className="text-2xl font-semibold text-white mb-6 text-center">
                    Upload Your Resume
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label
                        htmlFor="fileInput"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-500 rounded-xl cursor-pointer hover:border-indigo-500 transition"
                    >
                        <span className="text-gray-300 text-sm">
                            {file ? file.name : "Click to select PDF"}
                        </span>
                        <input
                            id="fileInput"
                            type="file"
                            accept="application/pdf"
                            className="hidden"
                            onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                            }
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={uploading || !file}
                        className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600 text-white py-2 rounded-xl transition font-medium"
                    >
                        {uploading ? "Uploading..." : "Upload Resume"}
                    </button>
                </form>

                <button
                    onClick={handleDownload}
                    className="w-full mt-4 border cursor-pointer border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white transition py-2 rounded-xl"
                >
                    Download Resume
                </button>

                <button
                    onClick={() => {
                        redirect("/CandidateDetails")
                    }}
                    className="w-full mt-4 border cursor-pointer border-indigo-500 text-indigo-400 hover:bg-indigo-500 hover:text-white transition py-2 rounded-xl"
                >
                    Proceed
                </button>

                {success && (
                    <p className="text-green-400 text-sm mt-4 text-center">
                        Resume uploaded successfully
                    </p>
                )}

            </div>
        </div>
    );
}