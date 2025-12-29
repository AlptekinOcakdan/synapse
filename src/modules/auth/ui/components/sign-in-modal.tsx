"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { SynapseLogo } from "@/components/synapse-logo";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface AuthModalProps {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

type AuthStep = "EMAIL" | "OTP";

export const SignInModal = ({ isOpen, onClose }: AuthModalProps) => {
    const router = useRouter();
    const [step, setStep] = useState<AuthStep>("EMAIL");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // E-posta gönderme simülasyonus
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        // API isteği simülasyonu (1.5 saniye)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        setStep("OTP");
    };

    // OTP doğrulama simülasyonu
    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return;

        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
        onClose(false);
        router.push("/dashboard");
    };

    const resetFlow = () => {
        setStep("EMAIL");
        setOtp("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(val) => {
            onClose(val);
            if (!val) setTimeout(resetFlow, 300); // Modal kapanınca state'i sıfırla
        }}>
            <DialogContent className="sm:max-w-100 bg-background border-border p-0 overflow-hidden gap-0">
                {/* Header Alanı */}
                <div className="p-6 pb-2 flex flex-col items-center text-center">
                    <div className="mb-4 scale-90">
                        <SynapseLogo />
                    </div>

                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-center">
                            {step === "EMAIL" ? "Hesabına Giriş Yap" : "Kodu Doğrula"}
                        </DialogTitle>
                        <DialogDescription className="text-center mx-auto max-w-70">
                            {step === "EMAIL"
                                ? "AYBU e-posta adresini girerek giriş yapabilir veya kayıt olabilirsin."
                                : <span className="text-foreground font-medium">{email}</span>}
                            {step === "OTP" && " adresine gönderilen 6 haneli kodu gir."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Form Alanı */}
                <div className="p-6 pt-2">
                    {step === "EMAIL" ? (
                        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="sr-only">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ogrenci@aybu.edu.tr"
                                        className="pl-9 bg-secondary/50 border-input/50 focus-visible:bg-background transition-colors h-11"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <Button type="submit" size="lg" className="w-full font-bold" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : "Giriş Kodunu Gönder"}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-6 items-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={setOtp}
                                onComplete={handleVerifyOtp}
                                disabled={isLoading}
                            >
                                {/* Gap-2 ile kutucukları ayırıyoruz */}
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>

                            <div className="flex flex-col gap-2 w-full">
                                <Button
                                    onClick={handleVerifyOtp}
                                    disabled={otp.length !== 6 || isLoading}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" /> : "Doğrula ve Giriş Yap"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setStep("EMAIL")}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    E-postayı Değiştir
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Bilgi Notu */}
                <div className="bg-secondary/30 p-4 text-center border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        Synapse&apos;a giriş yaparak <span className="underline cursor-pointer hover:text-foreground">Kullanım Koşulları</span>&apos;nı kabul etmiş olursunuz.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};