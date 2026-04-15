"use client";

import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {SynapseLogo} from "@/components/synapse-logo";
import {AnimatePresence} from "framer-motion";
import {BasicInfoSection} from "@/modules/auth/ui/sections/basic-info-section";
import {OTPSection} from "@/modules/auth/ui/sections/otp-section";
import {CVBuilderSection} from "@/modules/auth/ui/sections/cv-builder-section";
import {SignUpFormData} from "@/modules/auth/types";
import { useAction, useMutation } from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "sonner";

type Step = "BASIC_INFO" | "OTP" | "CV_BUILDER";

export const SignUpView = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>("BASIC_INFO");
    const [isLoading, setIsLoading] = useState(false);

    const sendOtpAction = useAction(api.auth.sendOtp);
    const verifyOtpMutation = useMutation(api.auth.verifyOtp);
    const completeSignUpMutation = useMutation(api.auth.completeStudentSignUp);

    // Form Verileri (Global State gibi davranır)
    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: "",
        lastName: "",
        email: "",
        otp: "",
        department: "",
        city: null,
        competencies: [],
        improvementAreas: [],
        isCompanyVisible: false,
        bio: "",
        experiences: [],
        competitions: [],
        certificates: [],
    });

    // Adım Geçişleri
    const handleBasicInfoSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await sendOtpAction({
                email: formData.email,
                firstName: formData.firstName
            });
            toast.success("Doğrulama kodu gönderildi!");
            setStep("OTP");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Bir hata oluştu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOTPSubmit = async () => {
        setIsLoading(true);
        try {
            await verifyOtpMutation({
                email: formData.email,
                code: formData.otp
            });
            toast.success("Kod doğrulandı!");
            setStep("CV_BUILDER");
        } catch {
            toast.error("Hatalı kod, lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async () => {
        setIsLoading(true);
        try {
            await completeSignUpMutation({
                ...formData,
                // profileImage null ise undefined olarak gönder veya olduğu gibi
                profileImage: formData.profileImage || undefined,
            });
            toast.success("Aramıza hoş geldin! 🎉");
            router.push("/dashboard");
        } catch {
            toast.error("Kayıt oluşturulurken bir hata oluştu.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {/* Üst Logo */}
            <div className="mb-8 scale-110">
                <SynapseLogo />
            </div>

            {/* Ana Kart */}
            <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden relative">
                {/* İlerleme Çubuğu (Basit) */}
                <div className="absolute top-0 left-0 h-1 bg-secondary w-full">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{
                            width: step === "BASIC_INFO" ? "33%" : step === "OTP" ? "66%" : "100%"
                        }}
                    />
                </div>

                <div className="p-6 md:p-10">
                    <AnimatePresence mode="wait">
                        {step === "BASIC_INFO" && (
                            <BasicInfoSection
                                key="basic"
                                data={formData}
                                updateData={setFormData}
                                onSubmit={handleBasicInfoSubmit}
                                isLoading={isLoading}
                            />
                        )}
                        {step === "OTP" && (
                            <OTPSection
                                key="otp"
                                email={formData.email}
                                otp={formData.otp}
                                setOtp={(val) => setFormData({...formData, otp: val})}
                                onSubmit={handleOTPSubmit}
                                isLoading={isLoading}
                                onBack={() => setStep("BASIC_INFO")}
                            />
                        )}
                        {step === "CV_BUILDER" && (
                            <CVBuilderSection
                                key="cv"
                                data={formData}
                                updateData={setFormData}
                                onSubmit={handleFinalSubmit}
                                isLoading={isLoading}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
                Zaten hesabın var mı? <a href="#" className="text-primary hover:underline">Giriş Yap</a>
            </p>
        </div>
    );
};