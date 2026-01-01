"use client";

import {useState, ChangeEvent} from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image as ImageIcon, X } from "lucide-react";

interface PhotoUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSend: (file: File) => void;
}

export const PhotoUploadDialog = ({ open, onOpenChange, onSend }: PhotoUploadDialogProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Dialog kapandığında state temizliği
    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen);
        if (!isOpen) {
            // Dialog kapanırken state'leri sıfırla
            setSelectedFile(null);
            setPreviewUrl(null);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleConfirm = () => {
        if (selectedFile) {
            onSend(selectedFile);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Fotoğraf Yükle</DialogTitle>
                    <DialogDescription>
                        JPG, PNG veya WEBP formatındaki görselleri paylaşın.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-xl min-h-50 relative bg-muted/5 overflow-hidden group">

                        {selectedFile && previewUrl ? (
                            <>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-contain max-h-75"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8 shadow-md"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPreviewUrl(null);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={handleFileChange}
                                />
                                <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                                    <div className="p-3 bg-background rounded-full shadow-sm ring-1 ring-border">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-medium">Fotoğraf seçmek için tıklayın</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button onClick={handleConfirm} disabled={!selectedFile}>Gönder</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};