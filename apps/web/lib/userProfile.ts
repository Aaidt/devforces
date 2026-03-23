"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";

type Profile = {
    profile_pic_url: string,
    first_name: string,
    role: "candidate" | "recruiter",
    user: {
        clerk_id: string,
        first_name: string,
        profile_pic_key: string,
        last_name: string,
        phone: number,
        email: string,
        bio: string,
        gh_url: string,
        lc_url?: string,
        cf_url?: string,
        ln_url?: string,
        wakatime_api?: string,
        company_name?: string,
        company_description?: string,
        company_website?: string,
        company_employees?: number,
    }
};

const cache = new Map<string, Profile>();

export function useProfile() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { getToken } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isLoaded || !isSignedIn) {
            setLoading(false);
            return;
        }

        const key = user.id;
        if (cache.has(key)) {
            setProfile(cache.get(key)!);
            setLoading(false);
            return;
        }

        async function fetchIt() {
            try {
                const token = await getToken();

                // Try user /me first
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/user/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = res.data;
                    if (data.first_name && data.profile_pic_url) {
                        cache.set(key, data);
                        setProfile(data);
                        return;
                    }
                } catch (e) {
                    // User endpoint failed, try admin
                }

                // Try admin /me
                try {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/admin/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const data = res.data;
                    if (data.first_name && data.profile_pic_url) {
                        cache.set(key, data);
                        setProfile(data);
                        return;
                    }
                } catch (e) {
                    // Admin endpoint also failed
                }

            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        fetchIt();
    }, [isLoaded, isSignedIn, user?.id, getToken]);

    return { profile, loading };
}