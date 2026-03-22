"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
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
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    if (!isLoaded || !userId) {
        return (
            <div className="flex bg-black min-h-screen items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setForm({ ...form, profile_pic: e.target.files[0] })
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
                throw new Error("Profile picture is required")
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
        <div className="min-h-screen bg-black pt-25 text-white flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-zinc-950 border border-zinc-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                
                <h1 className="text-3xl font-bold mb-2 text-white">Company Details</h1>
                <p className="text-zinc-400 mb-8 text-sm">Tell us about your company to get started with hiring.</p>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-300">Company Name <span className="text-red-500">*</span></label>
                        <input required type="text" name="companyName" value={form.companyName} onChange={handleChange} 
                            placeholder="Acme Inc."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600" />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-300">What does your company do? <span className="text-red-500">*</span></label>
                        <textarea required name="companyDescription" value={form.companyDescription} onChange={handleChange} rows={3} 
                            placeholder="We build..."
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600 resize-none" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-300">Website URL (Optional)</label>
                            <input type="url" name="companyWebsite" value={form.companyWebsite} onChange={handleChange} 
                                placeholder="https://acme.com"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600" />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-zinc-300">Number of Employees <span className="text-red-500">*</span></label>
                            <input required type="number" min="1" name="companyEmployees" value={form.companyEmployees} onChange={handleChange} 
                                placeholder="50"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-zinc-300">Company Logo <span className="text-red-500">*</span></label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-xl cursor-pointer bg-zinc-900 hover:bg-zinc-800/50 hover:border-zinc-700 transition-all">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {form.profile_pic ? (
                                        <p className="text-sm text-blue-400 font-medium">{form.profile_pic.name}</p>
                                    ) : (
                                        <>
                                            <svg className="w-8 h-8 mb-3 text-zinc-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                            <p className="mb-1 text-sm text-zinc-400"><span className="font-semibold text-zinc-300">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-zinc-500">PNG, JPG or GIF (MAX. 5MB)</p>
                                        </>
                                    )}
                                </div>
                                <input id="dropzone-file" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                        </div>
                    </div>

                    <button disabled={loading} type="submit" className="w-full cursor-pointer bg-white text-black font-semibold py-3.5 px-4 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                        {loading ? "Saving Company Details..." : "Complete Setup"}
                    </button>
                </form>
            </div>
        </div>
    )
}