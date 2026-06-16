import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
    return (
        <footer className="border-t border-border bg-background pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-center gap-12 mb-12">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="h-12 w-auto flex items-center">
                            <Image src="/aybu-logo.png" width={125} height={125} quality={100} alt="AYBU Logo" className="object-contain" />
                        </div>
                        <Separator
                            orientation="vertical"
                            className="h-8 w-px bg-border"
                        />
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-42">
                                <Image
                                    src="/940-logo.png"
                                    width={750}
                                    height={500}
                                    quality={100}
                                    alt="940 Solutions"
                                    className="object-contain w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground/60 text-sm">© 2025 Synapse. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6 text-sm text-muted-foreground/60">
                        <a href="#" className="hover:text-muted-foreground transition-colors">Gizlilik</a>
                        <a href="#" className="hover:text-muted-foreground transition-colors">Kullanım Şartları</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
