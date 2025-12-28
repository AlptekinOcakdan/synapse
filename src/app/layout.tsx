import type {Metadata} from "next";
import "./globals.css";
import {Inter} from "next/font/google";
import {TRPCProvider} from "@/trpc/client";
import {ReactNode} from "react";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Synapse",
    description: "Projelerin pazarı",
};

export default function RootLayout({children}: Readonly<{ children: ReactNode}>) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <TRPCProvider>
                    {children}
                    <Toaster/>
                </TRPCProvider>
            </body>
        </html>
    );
}
