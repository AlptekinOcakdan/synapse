import { useState } from "react";
import { toast } from "sonner";

export const useFileUpload = () => {
    const [isUploading, setIsUploading] = useState(false);

    const uploadFile = async (file: File): Promise<string | null> => {
        setIsUploading(true);
        try {
            // 1. Backend'den Upload URL iste
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
            });

            if (!res.ok) throw new Error("Upload URL alınamadı");

            const { uploadUrl, fileUrl } = await res.json();

            // 2. Dosyayı direkt S3'ye gönder (PUT işlemi)
            const uploadRes = await fetch(uploadUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            console.log(uploadRes);

            if (!uploadRes.ok) throw new Error("S3 yüklemesi başarısız");

            return fileUrl; // Dosyanın kalıcı linki
        } catch (error) {
            console.error(error);
            toast.error("Dosya yüklenirken bir hata oluştu.");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    return { uploadFile, isUploading };
};