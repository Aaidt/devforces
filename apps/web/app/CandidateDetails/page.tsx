"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"

export default function CandidateDetails() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [pic, setPic] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [ghUrl, setGhUrl] = useState("")
  const [lcUrl, setLcUrl] = useState("")
  const [cfUrl, setCfUrl] = useState("")

  const { getToken } = useAuth();

  // Handle image preview cleanup
  useEffect(() => {
    if (!pic) return
    const objectUrl = URL.createObjectURL(pic)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [pic])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = await getToken();
    await axios.post(`${process.env.BACKEND_URL}/v1/user/candidate-details`, {
        firstName, lastName, phone, pic, ghUrl, lcUrl, cfUrl
    }, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-zinc-900 via-black to-black px-4 py-20">
      <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
            Candidate Profile
          </h1>
          <p className="text-zinc-400 text-sm">Fill in your professional details to get started.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section: Personal Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Personal Information</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <InputField label="First Name" value={firstName} onChange={setFirstName} placeholder="John" />
              <InputField label="Last Name" value={lastName} onChange={setLastName} placeholder="Doe" />
            </div>

            <InputField label="Phone Number" value={phone} onChange={setPhone} placeholder="+91 98765 43210" type="tel" />

            {/* Profile Pic - Improved UX */}
            <div className="flex flex-col items-center sm:flex-row gap-6 p-4 rounded-2xl bg-white/2 border border-white/5">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-dashed border-white/20 group-hover:border-emerald-500/50 transition-colors">
                  {preview ? (
                    <Image src={preview} alt="preview" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                       <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round"/></svg>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium text-zinc-200">Profile Picture</label>
                <p className="text-xs text-zinc-500 mb-3">JPG, PNG or WebP. Max 2MB.</p>
                <label className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white cursor-pointer transition">
                  Choose Image
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setPic(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
          </section>

          {/* Section: Links */}
          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold">Online Presence</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="grid gap-4">
              <InputField label="GitHub" value={ghUrl} onChange={setGhUrl} placeholder="github.com/username" />
              <InputField label="LeetCode" value={lcUrl} onChange={setLcUrl} placeholder="leetcode.com/username" />
              <InputField label="Codeforces" value={cfUrl} onChange={setCfUrl} placeholder="codeforces.com/profile/username" />
            </div>
          </section>

          <button
            type="submit"
            className="w-full group relative overflow-hidden cursor-pointer bg-white text-black py-4 rounded-xl font-bold text-lg transition-all "
          >
            <span className="relative z-10">Save Candidate Details</span>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        </form>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type = "text" }: any) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[13px] font-medium text-zinc-400 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
      />
    </div>
  )
}