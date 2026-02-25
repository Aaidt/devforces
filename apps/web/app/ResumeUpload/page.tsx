"use client"

import axios from "axios";
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation";

export default function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [download, setDownload] = useState<boolean>(false)
    const { isSignedIn } = useUser();
    const router = useRouter();
    const { getToken } = useAuth();

    if (!isSignedIn) {
        alert("login first!!!");
        router.push("/");
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const token = await getToken();
        if (!file) return;

        const form_data = new FormData();
        form_data.append("file", file);

        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/upload_url`,
            JSON.stringify({
                filename: file.name,
                content_type: file.type
            }), {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
        });

        const { url, key } = await res.data;

        const response = await axios.put(url, file, { headers: { "Content-Type": file.type } })
        if (response.status === 200) {
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/confirm`, { key });
            alert("resume uploaded");
        } else {
            alert("resume not uploaded");
        }
    }

    async function handleDownload() {
        const token = await getToken();
        setDownload(true);
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
    }

    return <div className="pt-24 min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">Resume Upload</h1><br />

        <form onSubmit={(e) => handleSubmit(e)}>
            <input type="file" name="file"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="border"
                id="fileInput"
            /><br />
            <button type="submit" className="border">Upload</button>
        </form>

        <button onClick={() => handleDownload()}>Download resume</button>
        {download && <a download>Download Resume</a>}
    </div>
}