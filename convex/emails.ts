"use node";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = internalAction({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
        threadId: v.optional(v.id("mailThreads")),
    },
    handler: async (ctx, args) => {
        try {
            // 1. DEĞİŞİKLİK: Gerçek domain adresini buraya girdik
            const replyToAddress = args.threadId
                ? `reply+${args.threadId}@inbound.synapseplatform.com.tr`
                : "destek@synapseplatform.com.tr"; // İstersen buraya info@... da yazabilirsin

            const { data, error } = await resend.emails.send({
                // 2. DEĞİŞİKLİK: Gönderen kısmı da doğruladığımız subdomain olmalı
                // (Ana domaini ayrıca doğruladıysan onu da kullanabilirsin ama şu an garanti olan bu)
                from: "Synapse <bildirim@inbound.synapseplatform.com.tr>",
                to: [args.to],
                subject: args.subject,
                html: args.html,
                replyTo: replyToAddress,
            });

            if (error) {
                console.error("Resend API Hatası:", error);
                return { success: false, error: error };
            }

            return { success: true, messageId: data?.id };

        } catch (err) {
            console.error("Mail gönderim hatası:", err);
            return { success: false };
        }
    },
});