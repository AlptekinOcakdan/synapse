import {db} from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';
import { verifyAccessToken } from "@/lib/jwt";
import { headers, cookies } from "next/headers";

export const createTRPCContext = cache(async () => {
    const cookieStore = await cookies();
    let token = cookieStore.get("accessToken")?.value;

    if (!token) {
        const heads = await headers();
        const authHeader = heads.get("Authorization");
        if (authHeader) {
            token = authHeader.split(" ")[1];
        }
    }

    if (!token) {
        console.log("Token bulunamadı (Cookie veya Header boş).");
        return { userId: null };
    }

    try {
        const verifiedToken = verifyAccessToken(token);
        if (!verifiedToken?.userId) {
            return { userId: null };
        }

        return { userId: verifiedToken.userId };
    } catch (err) {
        console.error("Token verify hatası:", err);
        return { userId: null };
    }
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
    transformer: superjson,
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Protected Procedure (Middleware Loglarını tuttum, istersen silebilirsin)
export const protectedProcedure = t.procedure
    .use(async function isAuthed(opts) {
        const { ctx } = opts;


        if (!ctx.userId) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }

        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.userId, ctx.userId))
            .limit(1);

        if (!user) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "User not found in DB" });
        }

        return opts.next({
            ctx: {
                ...ctx,
                user
            }
        });
    });