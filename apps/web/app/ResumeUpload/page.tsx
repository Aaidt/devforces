"use client"

import axios from "axios";
import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation";

export default function ResumeUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [download, setDownload] = useState<boolean>(false)
    const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
    const { getToken } = useAuth();

    useEffect(() => {
        if(isLoaded && !isSignedIn){
            router.replace("/");
        };
    }, [isLoaded, isSignedIn, router])
    
    if(!isLoaded){
        return <div>loading...</div>
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const token = await getToken({ template: "backend" });

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
            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/confirm`, { key }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            alert("resume uploaded");
        } else {
            alert("resume not uploaded");
        }
    }

    async function handleDownload() {
        const token = await getToken({ template: "backend" });
        setDownload(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/resume/`, {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob"
        })

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.download = "resume.pdf";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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