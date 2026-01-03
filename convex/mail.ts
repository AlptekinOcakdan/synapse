"use node";

// action yerine internalAction import ediyoruz
import {action, internalAction} from "./_generated/server";
import { v } from "convex/values";
import nodemailer from "nodemailer";
import {internal} from "@/convex/_generated/api";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// BURASI DEĞİŞTİ: export const sendEmail = internalAction({...})
export const sendEmail = internalAction({
    args: {
        to: v.string(),
        subject: v.string(),
        html: v.string(),
    },
    handler: async (ctx, args) => {
        const info = await transporter.sendMail({
            from: `"Synapse" <${process.env.SMTP_USER}>`,
            to: args.to,
            subject: args.subject,
            html: args.html,
        });
        return { success: true, messageId: info.messageId };
    },
});

export const sendContactEmail = action({
    args: {
        academicianId: v.id("users"),
        subject: v.string(),
        message: v.string(),
        projectId: v.optional(v.id("projects")),
    },
    handler: async (ctx, args) => {
        // 1. Gönderen Kim?
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("E-posta göndermek için giriş yapmalısınız.");
        }

        // 2. Akademisyenin E-postasını Çek
        // DİKKAT: Diğer dosyadaki query'i çağırıyoruz (internal.academics...)
        const academician = await ctx.runQuery(internal.academics.getAcademicianPrivateInfo, {
            userId: args.academicianId,
        });

        if (!academician || !academician.email) {
            throw new Error("Akademisyene ulaşılamıyor.");
        }

        // 3. Proje Bilgileri
        let projectInfo = "";
        if (args.projectId) {
            const project = await ctx.runQuery(internal.academics.getProjectPublicInfo, {
                projectId: args.projectId,
            });
            if (project) {
                projectInfo = `\n\n--- İLGİLİ PROJE ---\nProje Adı: ${project.title}\nID: ${project._id}`;
            }
        }

        // 4. Nodemailer Ayarları
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 5. Gönderim
        await transporter.sendMail({
            from: `"Synapse Platform" <${process.env.SMTP_USER}>`,
            to: academician.email,
            replyTo: identity.email,
            subject: `[Synapse] ${args.subject}`,
            text: `Sayın ${academician.lastName},\n\n${identity.name} (${identity.email}) size Synapse üzerinden bir mesaj gönderdi:\n\n--------------------------------------------------\n\n${args.message}\n${projectInfo}\n\n--------------------------------------------------\nBu mesaj Synapse platformu üzerinden gönderilmiştir.`,
        });

        return { success: true };
    },
});