"use client";

import { createContext, useContext, ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface SessionContextType {
    userId: Id<"users"> | null;
    isAuthenticated: boolean;
}

const SessionContext = createContext<SessionContextType>({
    userId: null,
    isAuthenticated: false,
});

export const useSession = () => useContext(SessionContext);

interface SessionProviderProps {
    children: ReactNode;
    userId: string | null | undefined; // Server'dan string gelebilir
}

export const SessionProvider = ({ children, userId }: SessionProviderProps) => {
    // String ID'yi Convex ID tipine veya null'a çeviriyoruz
    const finalUserId = userId ? (userId as Id<"users">) : null;

    return (
        <SessionContext.Provider
            value={{
                userId: finalUserId,
                isAuthenticated: !!finalUserId
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};