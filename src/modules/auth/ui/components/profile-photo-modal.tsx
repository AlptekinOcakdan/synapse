"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface ProfilePhotoDialogProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    onSave: (image: string | null) => void;
    currentImage?: string | null;
}

export const ProfilePhotoDialog = ({ isOpen, onClose, onSave, currentImage }: ProfilePhotoDialogProps) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Dosya Seçme İşlemi
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Gerçek bir upload işlemi yerine şimdilik tarayıcıda önizleme URL'i oluşturuyoruz.
            // Backend bağlandığında burada FormData ile sunucuya gönderip URL alabilirsin.
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
        }
    };

    // Kaydetme
    const handleSave = () => {
        onSave(preview);
        onClose(false);
    };

    // Silme / Kaldırma
    const handleRemove = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Modal kapandığında (Vazgeçildiğinde) preview'ı eski haline getirmiyoruz
    // (Tercihe bağlı: İstersen useEffect ile isOpen değişince preview = currentImage yapabilirsin)

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-100">
                <DialogHeader>
                    <DialogTitle>Profil Fotoğrafı</DialogTitle>
                    <DialogDescription>
                        Seni en iyi yansıtan bir fotoğraf yükle. (Max 2MB)
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center gap-6 py-4">
                    {/* Önizleme Alanı */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary bg-secondary/30 flex items-center justify-center relative">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Preview"
                                    width={128}
                                    height={128}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                            )}
                        </div>

                        {/* Eğer fotoğraf varsa silme butonu göster */}
                        {preview && (
                            <button
                                onClick={handleRemove}
                                className="absolute top-0 right-0 bg-destructive text-white p-1.5 rounded-full shadow-md hover:bg-destructive/90 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Dosya Seçme Butonu */}
                    <div className="flex flex-col gap-2 w-full">
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outline"
                            className="w-full border-dashed border-2 py-8"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {preview ? "Fotoğrafı Değiştir" : "Bilgisayardan Seç"}
                        </Button>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => onClose(false)}>
                        Vazgeç
                    </Button>
                    <Button onClick={handleSave} disabled={!preview && !currentImage}>
                        Kaydet
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};