import {motion} from "framer-motion";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {SignUpFormData} from "@/modules/auth/types";
import {FormEvent} from "react";

interface BasicInfoSectionProps {
    data: SignUpFormData;
    updateData: (data: SignUpFormData) => void;
    onSubmit: (e: FormEvent) => void;
    isLoading: boolean;
}

export const BasicInfoSection = ({ data, updateData, onSubmit, isLoading }: BasicInfoSectionProps) => {
    return (
        <motion.form
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onSubmit={onSubmit}
            className="space-y-6"
        >
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Aramıza Hoş Geldin</h2>
                <p className="text-muted-foreground">Synapse topluluğuna katılmak için temel bilgilerini gir.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input
                        id="firstName"
                        placeholder="Örn: Ahmet"
                        required
                        value={data.firstName}
                        onChange={(e) => updateData({...data, firstName: e.target.value})}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input
                        id="lastName"
                        placeholder="Örn: Yılmaz"
                        required
                        value={data.lastName}
                        onChange={(e) => updateData({...data, lastName: e.target.value})}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Öğrenci E-postası</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="ogrencinumarasi@aybu.edu.tr"
                    required
                    value={data.email}
                    onChange={(e) => updateData({...data, email: e.target.value})}
                />
                <p className="text-[10px] text-muted-foreground">Sadece .edu.tr uzantılı mail adresleri kabul edilir.</p>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Devam Et"}
            </Button>
        </motion.form>
    );
};