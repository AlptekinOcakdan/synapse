"use client";

import {useState, ChangeEvent} from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, UploadCloud, X } from "lucide-react";

interface DocumentUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSend: (file: File) => void;
}

export const DocumentUploadDialog = ({ open, onOpenChange, onSend }: DocumentUploadDialogProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleOpenChange = (isOpen: boolean) => {
        onOpenChange(isOpen); // Parent'a bildir
        if (!isOpen) {
            setTimeout(() => setSelectedFile(null), 300);
            // Veya direkt: setSelectedFile(null);
        }
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
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
                    <DialogTitle>Belge Yükle</DialogTitle>
                    <DialogDescription>
                        PDF, DOCX veya TXT formatındaki dosyalarınızı yükleyebilirsiniz.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {!selectedFile ? (
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 hover:bg-muted/50 transition-colors cursor-pointer group relative">
                            <Input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                                <div className="p-3 bg-background rounded-full shadow-sm ring-1 ring-border">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-medium">Dosyayı buraya sürükleyin</p>
                                    <p className="text-xs text-muted-foreground/70">veya seçmek için tıklayın</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                            <div className="p-2 bg-background rounded-md border shadow-sm">
                                <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => setSelectedFile(null)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
                    <Button onClick={handleConfirm} disabled={!selectedFile}>Yükle</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};