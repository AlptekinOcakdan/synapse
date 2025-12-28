import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-center gap-12 mb-12">
                    <div className="flex items-center gap-6 mb-4">
                        <div className="h-12 w-auto flex items-center">
                            <Image src="/aybu-logo.png" width={200} height={85} quality={100} alt="AYBU Logo" className="object-contain" />
                        </div>
                        <Separator
                            orientation="vertical"
                            className="h-8 w-px bg-slate-700"
                        />
                        <div className="flex flex-col items-center justify-center">
                            {/* 940 Görseli */}
                            <div className="w-20 md:w-36"> {/* Logonun ekrandaki boyutu buradaki w- değeriyle yönetilir */}
                                <Image
                                    src="/940.png"
                                    width={750}
                                    height={500}
                                    quality={100}
                                    alt="940 Solutions"
                                    className="object-contain w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                />
                            </div>

                            {/* SOLUTIONS Yazısı */}
                            {/* -mt-1 veya -mt-2 ile görselle yazı arasındaki boşluğu kapatıyoruz */}
                            <span className="text-[9px] md:text-[17px] font-bold tracking-[0.35em] leading-none text-transparent bg-clip-text bg-linear-to-b from-white via-slate-200 to-slate-500 -mt-3 md:-mt-5 ml-1">
                                SOLUTIONS
                            </span>
                        </div>
                    </div>

                    {/* Contact Section */}
                    {/*<div>*/}
                    {/*    <h4 className="text-white font-semibold mb-4">İletişim</h4>*/}
                    {/*    <ul className="space-y-2 text-sm text-slate-400">*/}
                    {/*        <li className="flex items-center gap-2">*/}
                    {/*            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>*/}
                    {/*            AYBU Etlik Kampüsü*/}
                    {/*        </li>*/}
                    {/*        <li>info@synapse.aybu.edu.tr</li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-600 text-sm">© 2025 Synapse. Tüm hakları saklıdır.</p>
                    <div className="flex gap-6 text-sm text-slate-600">
                        <a href="#" className="hover:text-slate-400">Gizlilik</a>
                        <a href="#" className="hover:text-slate-400">Kullanım Şartları</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};