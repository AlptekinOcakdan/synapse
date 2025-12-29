"use client";

import {useRouter} from "next/navigation";
import {FormEvent, useState} from "react";
import {SynapseLogo} from "@/components/synapse-logo";
import {AnimatePresence} from "framer-motion";
import {BasicInfoSection} from "@/modules/auth/ui/sections/basic-info-section";
import {OTPSection} from "@/modules/auth/ui/sections/otp-section";
import {CVBuilderSection} from "@/modules/auth/ui/sections/cv-builder-section";
import {SignUpFormData} from "@/modules/auth/types";

type Step = "BASIC_INFO" | "OTP" | "CV_BUILDER";

export const SignUpView = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>("BASIC_INFO");
    const [isLoading, setIsLoading] = useState(false);

    // Form Verileri (Global State gibi davranır)
    const [formData, setFormData] = useState<SignUpFormData>({
        firstName: "",
        lastName: "",
        email: "",
        otp: "",
        department: "",
        skills: [],
        bio: "",
        experiences: [],
        competitions: [],
        certificates: [],
    });

    // Adım Geçişleri
    const handleBasicInfoSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // API Simülasyonu: Kayıt başlat ve OTP gönder
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        setStep("OTP");
    };

    const handleOTPSubmit = async () => {
        setIsLoading(true);
        // API Simülasyonu: OTP doğrula
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        setStep("CV_BUILDER");
    };

    const handleFinalSubmit = async () => {
        setIsLoading(true);
        // API Simülasyonu: Tüm profili kaydet
        await new Promise(r => setTimeout(r, 2000));
        console.log("Kayıt Tamamlandı:", formData);
        setIsLoading(false);
        router.push("/dashboard");
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