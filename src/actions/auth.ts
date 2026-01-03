"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction({ userId, role }: { userId: string, role: string }) {
    // 1. Session oluştur
    await createSession(userId, role);

    // 2. Role göre yönlendir
    if (role === "academician") {
        redirect("/academician");
    } else {
        redirect("/dashboard");
    }
}

export async function logoutAction() {
    await deleteSession();
    redirect("/");
}