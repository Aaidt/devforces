"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"

export default function CandidateDetails() {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [pic, setPic] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [ghUrl, setGhUrl] = useState<string>("")
  const [lcUrl, setLcUrl] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [cfUrl, setCfUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);

  const { getToken } = useAuth();

  useEffect(() => {
    if (!pic) return
    const objectUrl = URL.createObjectURL(pic)
    setPreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [pic])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!pic) {
      console.log("No profile picture selected");
      return;
    }

    const token = await getToken();
    if (!token) {
      console.log("No auth token");
      return;
    }

    setLoading(true);
    try {

      const { data } = await axios.post<{ url: string }>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/profile_pic/url`,
        {
          pic_name: pic.name,
          pic_type: pic.type,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!data?.url) {
        console.log("No URL returned from backend");
        return;
      }

      await axios.put(data.url, pic, {
        headers: {
          "Content-Type": pic.type,
        },
      });

      const confirmRes = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/details/confirm`,
        { firstName, lastName, phone, ghUrl, lcUrl, cfUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!confirmRes.data?.success) {
        console.log("DB update failed");
        return;
      }

      console.log("Profile updated successfully");

    } catch (err) {
      console.error("Profile submission failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-12 flex items-center justify-center bg-[#0a0a0a] px-4">

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.1),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">Candidate Profile</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest mt-2">Professional Details</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col gap-8">
            
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white/90 border-b border-white/5 pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="First Name*" value={firstName} onChange={setFirstName} placeholder="John" required />
                <InputField label="Last Name*" value={lastName} onChange={setLastName} placeholder="Doe" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Email Address*" type="email" value={email} onChange={setEmail} placeholder="john@example.com" required />
                <InputField label="Phone Number*" type="tel" value={phone} onChange={setPhone} placeholder="+91..." required />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white/90 border-b border-white/5 pb-2">Profile Picture*</h2>
              <div className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-zinc-800 border border-white/10 flex-shrink-0">
                  {preview ? (
                    <Image src={preview} alt="preview" fill className="object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-600">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-400 mb-3 text-center md:text-left">Upload a professional photo for your profile.</p>
                  <label className="block w-full md:w-max px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-lg text-xs font-bold text-white cursor-pointer transition text-center">
                    {pic ? "Change Photo" : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => setPic(e.target.files?.[0] || null)} />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-white/90 border-b border-white/5 pb-2">Professional Links</h2>
              <div className="space-y-6">
                <InputField label="GitHub Profile*" value={ghUrl} onChange={setGhUrl} placeholder="https://github.com/your-username" required />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="LeetCode" value={lcUrl} onChange={setLcUrl} placeholder="username" />
                  <InputField label="Codeforces" value={cfUrl} onChange={setCfUrl} placeholder="username" />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white cursor-pointer hover:bg-white/70 text-black py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-500 mt-6"
          >
            {loading ? "Saving Changes..." : "Save Profile Details"}
          </button>
        </form>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type = "text", required = false }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all"
      />
    </div>
  )
}