import {create} from "zustand";
import {userSelectSchema} from "@/db/schema";
import {z} from "zod";

type AuthState = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    refreshToken: string | null;
    setRefreshToken: (token: string | null) => void;
    user: z.infer<typeof userSelectSchema> | null;
    setUser: (user: z.infer<typeof userSelectSchema> | null) => void;
}

function getInitialAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
}

function getInitialRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
}

function getInitialUser(): z.infer<typeof userSelectSchema> | null {
    if (typeof window === "undefined") return null;
    const userJson = localStorage.getItem("user");
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch {
            return null;
        }
    }
    return null;
}

export const useAuthStore = create<AuthState>((set)=>({
    accessToken: getInitialAccessToken(),
    setAccessToken: (token) => {
        if (typeof window !== "undefined") {
            if (token) {
                localStorage.setItem("accessToken", token);
            } else {
                localStorage.removeItem("accessToken");
            }
        }
        set({accessToken: token});
    },
    refreshToken: getInitialRefreshToken(),
    setRefreshToken: (token) => {
        if (typeof window !== "undefined") {
            if (token) {
                localStorage.setItem("refreshToken", token);
            } else {
                localStorage.removeItem("refreshToken");
            }
        }
        set({refreshToken: token});
    },
    user: getInitialUser(),
    setUser: (user) => {
        if (typeof window !== "undefined") {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                localStorage.removeItem("user");
            }
        }
        set({user});
    }
}))