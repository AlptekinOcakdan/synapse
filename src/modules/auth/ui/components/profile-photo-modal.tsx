"use client";

import { useState, useRef, ChangeEvent, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, X, Loader2, Check, ZoomIn } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
// Kendi hook yolunuza göre düzenleyin
import { useFileUpload } from "@/modules/users/server/procedures";
// Yeni importlar
import Cropper, {Area, Point} from "react-easy-crop";
// Adım 2'de oluşturduğumuz utility dosyasının yolu
import getCroppedImg from "@/lib/cropImage";

interface ProfilePhotoDialogProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
    onSave: (image: string | null) => void;
    currentImage?: string | null;
}

export const ProfilePhotoDialog = ({ isOpen, onClose, onSave, currentImage }: ProfilePhotoDialogProps) => {
    // --- Mevcut State'ler ---
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    // Yüklenecek SON dosya (kırpılmış hali)
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadFile, isUploading } = useFileUpload();

    // --- Kırpma (Crop) State'leri ---
    const [isCropping, setIsCropping] = useState(false);
    // Kırpma editöründe gösterilecek ham görselin URL'i
    const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    // Kırpma tamamlandığında elde edilen piksel koordinatları
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [isProcessingCrop, setIsProcessingCrop] = useState(false);


    // Dosya Seçme İşlemi (Değişti)
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Dosya boyutu kontrolü (örn: 5MB - Ham dosya için)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Dosya boyutu 5MB'dan küçük olmalıdır.");
                return;
            }

            // Kırpma modunu başlat
            const objectUrl = URL.createObjectURL(file);
            setCropImageSrc(objectUrl);
            setIsCropping(true);
            setZoom(1); // Zoomu sıfırla
        }
        // Input değerini sıfırla ki aynı dosyayı tekrar seçebilelim
        e.target.value = "";
    };

    // Kırpma alanı değiştiğinde çalışır (Kütüphane gereksinimi)
    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Kırpma işlemini onayla ve görseli oluştur
    const handleCropConfirm = async () => {
        if (!cropImageSrc || !croppedAreaPixels) return;
        setIsProcessingCrop(true);

        try {
            // Utility fonksiyonu ile kırpılmış blob'u al
            const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels);

            if (!croppedBlob) {
                throw new Error("Kırpma işlemi başarısız oldu.");
            }

            // Blob'u File objesine çevir (S3 yüklemesi için)
            const croppedFile = new File([croppedBlob], "profile-cropped.jpg", { type: "image/jpeg" });

            // Yeni önizleme oluştur
            const newPreviewUrl = URL.createObjectURL(croppedBlob);

            // State'leri güncelle
            setSelectedFile(croppedFile);
            setPreview(newPreviewUrl);

            // Kırpma modundan çık
            setIsCropping(false);
            setCropImageSrc(null);

            toast.success("Fotoğraf kırpıldı. Kaydetmeyi unutmayın.");

        } catch (error) {
            console.error(error);
            toast.error("Fotoğraf kırpılırken bir hata oluştu.");
        } finally {
            setIsProcessingCrop(false);
        }
    };

    // Kırpma işlemini iptal et
    const handleCropCancel = () => {
        setIsCropping(false);
        setCropImageSrc(null);
        // Eğer input'tan dosya seçilmiş ama kırpma iptal edilmişse inputu temizle
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Ana Kaydetme ve Upload İşlemi (Mevcut)
    const handleSave = async () => {
        if (isCropping) return; // Kırpma modundayken ana kaydet çalışmamalı

        try {
            // 1. Durum: Yeni (kırpılmış) dosya varsa S3'ye yükle
            if (selectedFile) {
                const s3Url = await uploadFile(selectedFile);
                if (s3Url) {
                    onSave(s3Url);
                    closeDialog();
                }
            }
            // 2. Durum: Dosya değişmediyse veya silindiyse
            else {
                onSave(preview);
                closeDialog();
            }
        } catch (error) {
            console.error("Profil fotoğrafı kaydedilemedi:", error);
            toast.error("Kaydetme işlemi başarısız.");
        }
    };

    // Silme / Kaldırma
    const handleRemove = () => {
        setPreview(null);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Dialogu kapat ve state'leri temizle
    const closeDialog = (open: boolean = false) => {
        if (isUploading || isProcessingCrop) return;
        onClose(open);
        // State temizliği (kısa bir gecikme ile kapanış animasyonu bozulmasın)
        setTimeout(() => {
            setIsCropping(false);
            setCropImageSrc(null);
            setSelectedFile(null);
            setPreview(currentImage || null);
        }, 300);
    };


    return (
        <Dialog open={isOpen} onOpenChange={closeDialog}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isCropping ? "Fotoğrafı Kırp" : "Profil Fotoğrafı"}
                    </DialogTitle>
                    <DialogDescription>
                        {isCropping
                            ? "Fotoğrafı kare içine alacak şekilde sürükleyin ve yakınlaştırın."
                            : "Seni en iyi yansıtan bir fotoğraf yükle. (Max 5MB)"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {/* --- KIRPMA MODU ARAYÜZÜ --- */}
                    {isCropping && cropImageSrc ? (
                        <div className="flex flex-col gap-4">
                            {/* Cropper Alanı - relative ve yükseklik önemli */}
                            <div className="relative w-full h-80 bg-black/5 rounded-md overflow-hidden">
                                <Cropper
                                    image={cropImageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1} // Kare (1:1) oranı
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                    showGrid={true}
                                />
                            </div>
                            {/* Zoom Slider */}
                            <div className="flex items-center gap-2 px-2">
                                <ZoomIn className="w-4 h-4 text-muted-foreground" />
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>
                    ) : (
                        /* --- NORMAL MOD ARAYÜZÜ (Mevcut Kod) --- */
                        <div className="flex flex-col items-center justify-center gap-6">
                            {/* Önizleme Alanı */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-secondary bg-secondary/30 flex items-center justify-center relative shrink-0">
                                    {preview ? (
                                        <Image
                                            src={preview}
                                            alt="Preview"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover"
                                            // S3'ten gelen bazı görseller için gerekebilir, duruma göre kaldırabilirsiniz.
                                            unoptimized={true}
                                        />
                                    ) : (
                                        <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                                    )}
                                </div>

                                {preview && !isUploading && (
                                    <button
                                        onClick={handleRemove}
                                        type="button"
                                        className="absolute top-0 right-0 bg-destructive text-white p-1.5 rounded-full shadow-md hover:bg-destructive/90 transition-colors z-10"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Dosya Seçme Butonu */}
                            <div className="flex flex-col gap-2 w-full">
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg, image/webp"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-dashed border-2 py-8"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {preview ? "Fotoğrafı Değiştir" : "Bilgisayardan Seç"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* --- FOOTER BUTONLARI --- */}
                <DialogFooter className="gap-2 sm:gap-0">
                    {isCropping ? (
                        // Kırpma Modu Footer'ı
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleCropCancel}
                                disabled={isProcessingCrop}
                            >
                                <X className="w-4 h-4 mr-2" /> İptal
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCropConfirm}
                                disabled={isProcessingCrop}
                            >
                                {isProcessingCrop ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="w-4 h-4 mr-2" />
                                )}
                                Uygula
                            </Button>
                        </>
                    ) : (
                        // Normal Mod Footer'ı
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => closeDialog(false)}
                                disabled={isUploading}
                            >
                                Vazgeç
                            </Button>
                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={isUploading || (!selectedFile && preview === currentImage)}
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yükleniyor...
                                    </>
                                ) : (
                                    "Kaydet"
                                )}
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};