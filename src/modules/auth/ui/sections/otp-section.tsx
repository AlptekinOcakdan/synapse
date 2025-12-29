import {motion} from "framer-motion";
import {InputOTP, InputOTPGroup, InputOTPSlot} from "@/components/ui/input-otp";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface OTPSectionProps {
    email: string;
    otp: string;
    setOtp: (value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
    onBack: () => void;
}

export const OTPSection = ({ email, otp, setOtp, onSubmit, isLoading, onBack }: OTPSectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center space-y-6 text-center"
        >
            <div className="space-y-2 mb-4">
                <h2 className="text-2xl font-bold">Kodu Doğrula</h2>
                <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">{email}</span> adresine gönderilen 6 haneli kodu gir.
                </p>
            </div>

            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} className="w-10 h-12 md:w-12 md:h-14 text-lg" />
                    ))}
                </InputOTPGroup>
            </InputOTP>

            <div className="flex flex-col w-full gap-3 mt-4">
                <Button onClick={onSubmit} size="lg" disabled={otp.length !== 6 || isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Doğrula"}
                </Button>
                <Button variant="ghost" onClick={onBack} disabled={isLoading}>
                    Geri Dön
                </Button>
            </div>
        </motion.div>
    );
};