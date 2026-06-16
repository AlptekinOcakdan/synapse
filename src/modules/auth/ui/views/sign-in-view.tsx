"use client";

import {FormEvent, useState} from "react";
import {SynapseLogo} from "@/components/synapse-logo";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {ArrowLeft, Loader2, Mail} from "lucide-react";
import {Label} from "@/components/ui/label";
import {useAction, useMutation} from "convex/react";
import {toast} from "sonner";
import {api} from "@/convex/_generated/api";
import {loginAction} from "@/actions/auth";

type AuthStep = "EMAIL" | "OTP";

export const SignInView = () => {
    const [step, setStep] = useState<AuthStep>("EMAIL");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const sendSignInCode = useAction(api.auth.sendSignInCode);
    const verifySignIn = useMutation(api.auth.verifySignIn);

    const handleSendCode = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setIsLoading(true);
        try {
            await sendSignInCode({email});
            toast.success("Doğrulama kodu gönderildi!");
            setStep("OTP");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) return;
        setIsLoading(true);
        try {
            const result = await verifySignIn({email, code: otp});
            toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
            await loginAction({userId: result.userId, role: result.role});
        } catch {
            toast.error("Kod hatalı veya süresi dolmuş.");
            setOtp("");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="mb-8 scale-110">
                <SynapseLogo/>
            </div>

            <div className="w-[92vw] sm:max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 pb-2 flex flex-col items-center text-center">
                    <h1 className="text-xl font-bold text-foreground mb-1">
                        {step === "EMAIL" ? "Hesabına Giriş Yap" : "Kodu Doğrula"}
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        {step === "EMAIL"
                            ? "AYBU e-posta adresini girerek hesabına eriş."
                            : <><span className="text-foreground font-medium">{email}</span> adresine gönderilen 6 haneli kodu gir.</>}
                    </p>
                </div>

                <div className="p-6 pt-4">
                    {step === "EMAIL" ? (
                        <form onSubmit={handleSendCode} className="flex flex-col gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="sr-only">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
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
                                {isLoading ? <Loader2 className="animate-spin mr-2"/> : "Giriş Kodunu Gönder"}
                            </Button>
                        </form>
                    ) : (
                        <div className="flex flex-col gap-6 items-center">
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={setOtp}
                                onComplete={() => {
                                    if (otp.length === 6 && !isLoading) void handleVerifyOtp();
                                }}
                                disabled={isLoading}
                            >
                                <InputOTPGroup className="gap-2">
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                    <InputOTPSlot index={4}/>
                                    <InputOTPSlot index={5}/>
                                </InputOTPGroup>
                            </InputOTP>

                            <div className="flex flex-col gap-2 w-full">
                                <Button
                                    onClick={handleVerifyOtp}
                                    disabled={otp.length !== 6 || isLoading}
                                    className="w-full"
                                    size="lg"
                                >
                                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : "Doğrula ve Giriş Yap"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setStep("EMAIL")}
                                    className="text-muted-foreground hover:text-foreground"
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2"/>
                                    E-postayı Değiştir
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-secondary/30 p-4 text-center border-t border-border space-y-2">
                    <p className="text-xs text-muted-foreground">
                        Synapse&apos;a giriş yaparak{" "}
                        <span className="underline cursor-pointer hover:text-foreground">Kullanım Koşulları</span>&apos;nı kabul etmiş olursunuz.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Hesabın yok mu?{" "}
                        <a href="/sign-up" className="text-primary hover:underline font-medium">
                            Kayıt Ol
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};
