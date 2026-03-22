"use client"

import { useAuth } from "@clerk/nextjs"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function HiringDetails() {
    const { getToken, isLoaded, userId } = useAuth()
    const router = useRouter()

    const [form, setForm] = useState({
        companyName: "",
        companyDescription: "",
        companyWebsite: "",
        companyEmployees: "",
        profile_pic: null as File | null
    })
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    if (!isLoaded || !userId) {
        return (
            <div className="flex bg-[#0a0a0a] min-h-screen items-center justify-center">
                <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setForm({ ...form, profile_pic: file })
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const token = await getToken()
            if (!token) throw new Error("Authentication error: No token")
            
            if (!form.profile_pic) {
                throw new Error("Company logo is required")
            }

            const { data: urlData } = await axios.post("http://localhost:3000/v1/admin/hiring/profile_pic/url", {
                pic_name: form.profile_pic.name,
                pic_type: form.profile_pic.type
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!urlData.url) throw new Error("Failed to get upload URL")

            await axios.put(urlData.url, form.profile_pic, {
                headers: { "Content-Type": form.profile_pic.type }
            })
            
            await axios.post("http://localhost:3000/v1/admin/hiring/details/confirm", {
                companyName: form.companyName,
                companyDescription: form.companyDescription,
                companyWebsite: form.companyWebsite || undefined,
                companyEmployees: Number(form.companyEmployees)
            }, {
                headers: { Authorization: `Bearer ${token}` }
            })

            router.push("/")
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || err.message || "An unexpected error occurred.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.06),transparent_50%)] pt-28 pb-16 text-white flex items-start justify-center px-4">
            <div className="max-w-2xl w-full">
                {/* Progress indicator */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-black text-xs font-bold flex items-center justify-center">1</div>
                        <span className="text-sm font-medium text-white">Company Details</span>
                    </div>
                    <div className="flex-1 h-px bg-white/10" />
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white/30 text-xs font-bold flex items-center justify-center">2</div>
                        <span className="text-sm font-medium text-white/30">Start Hiring</span>
                    </div>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                    
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Company Details</h1>
                        <p className="text-white/40 text-sm">Tell us about your company to get started with hiring on Devforces.</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Company Name <span className="text-red-500">*</span></label>
                            <input required type="text" name="companyName" value={form.companyName} onChange={handleChange} 
                                placeholder="Acme Inc."
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all" />
                        </div>
                        
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">What does your company do? <span className="text-red-500">*</span></label>
                            <textarea required name="companyDescription" value={form.companyDescription} onChange={handleChange} rows={3} 
                                placeholder="We build developer tools that..."
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all resize-none" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Website URL</label>
                                <input type="url" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} 
                                    placeholder="https://acme.com"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all" />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Employees <span className="text-red-500">*</span></label>
                                <input required type="number" min="1" name="companyEmployees" value={form.companyEmployees} onChange={handleChange} 
                                    placeholder="50"
                                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">Company Logo <span className="text-red-500">*</span></label>
                            <div className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 flex-shrink-0">
                                    {preview ? (
                                        <img src={preview} alt="logo preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-600">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-zinc-400 mb-3">Upload your company logo. PNG, JPG or SVG.</p>
                                    <label className="inline-block px-5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg text-xs font-bold text-white cursor-pointer transition">
                                        {form.profile_pic ? "Change Logo" : "Upload Logo"}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="w-full cursor-pointer bg-white hover:bg-zinc-100 text-black font-bold py-4 px-4 rounded-xl transition-all active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed mt-2 text-sm">
                            {loading ? "Setting up your company..." : "Complete Setup →"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}