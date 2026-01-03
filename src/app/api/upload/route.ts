import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";
import { s3Client } from "@/lib/aws";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session")?.value;
        const session = await decrypt(sessionCookie);

        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Dosya bilgilerini al
        const { filename, contentType } = await req.json();

        // 3. Dosya ismini benzersiz yap
        const uniqueFilename = `${session.userId}/${Date.now()}-${filename}`;

        // 4. Presigned URL oluştur
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFilename,
            ContentType: contentType,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

        // 5. Yanıt dön
        return NextResponse.json({
            uploadUrl: signedUrl,
            fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`,
        });
    } catch (error) {
        console.error("S3 Upload Error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}