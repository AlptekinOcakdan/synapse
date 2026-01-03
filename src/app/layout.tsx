import type {Metadata} from "next";
import "./globals.css";
import {Inter} from "next/font/google";
import {ReactNode} from "react";
import {Toaster} from "@/components/ui/sonner";
import {ConvexClientProvider} from "@/providers/convex-client-provider";
import { SessionProvider } from "@/providers/session-provider";
import {getSession} from "@/lib/session";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Synapse",
    description: "Projelerin pazarı",
};

export default async function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    const session = await getSession();
    const userId = session?.userId || null;
    return (
        <html lang="tr" className="dark">
            <body className={inter.className}>
            <SessionProvider userId={userId}>
                <ConvexClientProvider>
                    {children}
                    <Toaster/>
                </ConvexClientProvider>
            </SessionProvider>
            </body>
        </html>
    );
}
