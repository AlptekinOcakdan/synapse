import { v } from "convex/values";
import {action, internalMutation, internalQuery, mutation} from "./_generated/server";
import { internal } from "./_generated/api";

// --- YARDIMCI MUTATION: OTP'yi veritabanına kaydet ---
// Bu fonksiyonu sadece 'action' içinden çağıracağız, dışarıya kapalı (internal).
export const saveOtp = internalMutation({
    args: { email: v.string(), code: v.string() },
    handler: async (ctx, args) => {
        // Varsa eski kodu sil (Clean slate)
        const existing = await ctx.db
            .query("authCodes")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) {
            await ctx.db.delete(existing._id);
        }

        // Yeni kodu kaydet (15 dakika geçerli)
        await ctx.db.insert("authCodes", {
            email: args.email,
            code: args.code,
            expiresAt: Date.now() + 15 * 60 * 1000,
        });
    },
});

// --- ADIM 1: OTP GÖNDERME (ACTION) ---
export const sendOtp = action({
    args: { email: v.string(), firstName: v.string() },
    handler: async (ctx, args) => {
        // 1. E-posta uzantı kontrolü
        // if (!args.email.endsWith(".edu.tr")) {
        //     throw new Error("Sadece .edu.tr uzantılı e-postalar kabul edilir.");
        // }

        // 2. Rastgele 6 haneli kod üret
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Kodu veritabanına kaydet (Mutation çağrısı)
        await ctx.runMutation(internal.auth.saveOtp, {
            email: args.email,
            code: code,
        });

        // 4. Mail Servisini Çağır (Action içinden Action çağrısı)
        // HTML şablonunu burada hazırlayıp mail servisine sadece metni gönderiyoruz.
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Merhaba ${args.firstName},</h2>
        <p>Synapse'e hoş geldin! Kaydını tamamlamak için aşağıdaki doğrulama kodunu kullanabilirsin:</p>
        <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
          ${code}
        </div>
        <p>Bu kod 15 dakika boyunca geçerlidir.</p>
      </div>
    `;

        // mail.ts içindeki sendEmail aksiyonunu tetikliyoruz
        await ctx.runAction(internal.mail.sendEmail, {
            to: args.email,
            subject: "Synapse Giriş Kodun",
            html: emailHtml
        });

        return { success: true, message: "Doğrulama kodu gönderildi." };
    },
});

// --- ADIM 2: OTP DOĞRULAMA (MUTATION) ---
export const verifyOtp = mutation({
    args: { email: v.string(), code: v.string() },
    handler: async (ctx, args) => {
        const record = await ctx.db
            .query("authCodes")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!record) {
            throw new Error("Kod bulunamadı veya süresi dolmuş.");
        }

        if (record.code !== args.code) {
            throw new Error("Hatalı doğrulama kodu.");
        }

        if (Date.now() > record.expiresAt) {
            await ctx.db.delete(record._id); // Süresi dolmuşsa temizle
            throw new Error("Kodun süresi dolmuş. Lütfen tekrar deneyin.");
        }

        // Not: Kodu hemen silmiyoruz, son adımda (register) tekrar kontrol edebiliriz
        // veya frontend'e "verified" token dönebiliriz. Şimdilik flow basit kalsın diye dokunmuyoruz.

        return { success: true };
    },
});

// --- ADIM 3: KAYDI TAMAMLAMA (MUTATION) ---
export const completeStudentSignUp = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        city: v.union(v.string(), v.null()),
        otp: v.string(),
        department: v.string(),
        bio: v.string(),
        skills: v.array(v.string()),

        // Buraya artık Base64 değil, S3'den dönen URL gelecek (örn: https://bucket.s3.../image.jpg)
        profileImage: v.optional(v.string()),

        experiences: v.array(
            v.object({
                institution: v.string(),
                duration: v.string(),
                description: v.string(),
                role: v.optional(v.string()),
                order: v.number(),
            })
        ),
        competitions: v.array(
            v.object({
                name: v.string(),
                rank: v.string(),
                date: v.optional(v.string()),
            })
        ),
        certificates: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        // 1. Güvenlik Kontrolü: OTP hala geçerli mi?
        const authCode = await ctx.db
            .query("authCodes")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!authCode || authCode.code !== args.otp) {
            throw new Error("Güvenlik ihlali: Doğrulama kodu geçersiz.");
        }

        // 2. Kullanıcı zaten kayıtlı mı?
        const existingUser = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existingUser) {
            throw new Error("Bu e-posta adresi ile kayıtlı bir kullanıcı zaten var.");
        }

        // 3. Kullanıcıyı Oluştur
        // Not: args.profileImage artık direkt URL olduğu için işleme gerek yok.
        const userId = await ctx.db.insert("users", {
            firstName: args.firstName,
            lastName: args.lastName,
            email: args.email,
            city: args.city,
            department: args.department,
            bio: args.bio,
            title: "Lisans Öğrencisi",
            role: "student",
            skills: args.skills,
            experiences: args.experiences,
            competitions: args.competitions,
            certificates: args.certificates,

            // Eğer resim yüklenmişse URL'i, yoksa boş string veya varsayılan avatar
            avatar: args.profileImage || "",

            socialLinks: {},
            isAvailable: true,
        });

        // 4. Temizlik: Kullanılan OTP kodunu sil
        await ctx.db.delete(authCode._id);

        return { userId };
    },
});


export const checkUserExists = internalQuery({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
        return !!user; // True veya False döner
    },
});

// ADIM 1: Giriş Kodunu Gönder (Action)
export const sendSignInCode = action({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        // 1. Kullanıcı kayıtlı mı kontrol et?
        const userExists = await ctx.runQuery(internal.auth.checkUserExists, {
            email: args.email
        });

        if (!userExists) {
            // Güvenlik notu: Normalde "Kullanıcı bulunamadı" demek yerine muğlak konuşulur
            // ama kullanıcı deneyimi için şimdilik net bilgi veriyoruz.
            throw new Error("Bu e-posta adresi ile kayıtlı bir hesap bulunamadı. Lütfen önce kayıt olun.");
        }

        // 2. Rastgele kod üret
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Kodu kaydet (Mevcut fonksiyonu kullanıyoruz)
        await ctx.runMutation(internal.auth.saveOtp, {
            email: args.email,
            code: code,
        });

        // 4. Mail at (Mevcut mail servisini kullanıyoruz)
        const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Tekrar Hoş Geldin!</h2>
        <p>Hesabına giriş yapmak için aşağıdaki kodu kullanabilirsin:</p>
        <div style="background-color: #f4f4f5; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0;">
          ${code}
        </div>
        <p>Bu kod 15 dakika geçerlidir.</p>
      </div>
    `;

        await ctx.runAction(internal.mail.sendEmail, {
            to: args.email,
            subject: "Synapse Giriş Kodu",
            html: emailHtml
        });

        return { success: true };
    },
});

// ADIM 2: Giriş Doğrulama (Mutation)
export const verifySignIn = mutation({
    args: { email: v.string(), code: v.string() },
    handler: async (ctx, args) => {
        // 1. OTP Kontrolü (Auth tablosundan)
        const authCode = await ctx.db
            .query("authCodes")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!authCode || authCode.code !== args.code) {
            throw new Error("Geçersiz veya süresi dolmuş kod.");
        }

        if (Date.now() > authCode.expiresAt) {
            await ctx.db.delete(authCode._id);
            throw new Error("Kodun süresi dolmuş.");
        }

        // 2. Kullanıcıyı Bul
        const user = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (!user) {
            // Teorik olarak sendSignInCode bunu engeller ama yine de double-check
            throw new Error("Kullanıcı bulunamadı.");
        }

        // 3. Temizlik: Kullanılan kodu sil
        await ctx.db.delete(authCode._id);

        // 4. Kullanıcı ID'sini ve rolünü dön (Frontend'de session başlatmak için)
        return { userId: user._id, role: user.role };
    },
});

