import React from "react";
import {
    Network,
    Cpu,
    Layers,
    ArrowRight,
    Target,
    Lightbulb,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HomeNavigationBar } from "@/modules/home/ui/components/home-navigation-bar";
import { Footer } from "@/modules/home/ui/sections/footer-section";
import { BackgroundEffects } from "@/modules/home/ui/components/background-effects";
import Image from "next/image";

export default function CorporatePage() {
    return (
        <div className="min-h-dvh bg-slate-950 text-slate-200 font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">

            {/* Arka Plan Efektleri */}
            <BackgroundEffects />

            {/* --- HERO SECTION --- */}
            <section className="relative overflow-hidden py-24 lg:py-32 border-b z-10">
                <HomeNavigationBar />

                <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
                    <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium mb-8 animate-in fade-in zoom-in duration-500">
                    <span className="relative flex h-2 w-2">
                        <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                        940 Solutions
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-foreground">
                        Vizyonun ve{" "}
                        <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-cyan-400">
                            Teknolojinin
                        </span>
                        <br/>
                        <span className="text-foreground relative inline-block">
                            Kesişim Noktası
                            <svg
                                className="absolute w-full h-3 -bottom-2 left-0 text-primary opacity-60"
                                viewBox="0 0 200 9"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M2.00025 6.99997C25.7538 5.61749 59.8559 1.70111 120.943 3.96839C168.125 5.71966 195.918 5.71966 197.943 6.99997"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Fikrin stratejisi, teknolojinin geleceği. Karmaşık sorunları sadeleştiriyor,
                        teorik bilgiyi uygulanabilir projelere dönüştürüyoruz.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button size="lg" className="h-12 px-8 text-base group rounded-full font-semibold">
                            Ekosistemi Keşfet
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full hover:bg-muted/50 font-semibold">
                            İletişime Geç
                        </Button>
                    </div>
                </div>
            </section>

            {/* --- BİZ KİMİZ (KURUMSAL) --- */}
            <section className="py-24 bg-background relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">

                        {/* Sol: Metin */}
                        <div className="space-y-8">
                            <div>
                                {/* GÜNCELLEME: Font Hero ile eşitlendi */}
                                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
                                    Biz Kimiz?
                                </h2>
                                <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-cyan-500 rounded-full" />
                            </div>

                            <div className="prose prose-lg dark:prose-invert text-muted-foreground">
                                <p className="text-lg leading-relaxed">
                                    <strong className="text-foreground font-bold">940 Solutions</strong>, fikirlerin teknolojiyle hayat bulduğu bir sistem mimarisi ve strateji merkezidir.
                                </p>
                                <br/>
                                <p>
                                    Bizim için teknoloji bir amaç değil; potansiyeli gerçeğe dönüştüren en güçlü araçtır.
                                    Karmaşık sorunları sadeleştiren ve teknolojiyi toplumsal fayda odağında yeniden kurgulayan
                                    bir vizyonla hareket ediyoruz.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4">
                                {/* GÜNCELLEME: Kartlar daha belirgin hale getirildi */}
                                <div className="group flex flex-col gap-3 p-5 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-300">
                                    <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <Target className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-lg">Strateji Merkezi</h4>
                                    <p className="text-sm text-muted-foreground leading-snug">Teorik bilgiyi pratiğe dönüştürme sanatı.</p>
                                </div>
                                <div className="group flex flex-col gap-3 p-5 rounded-2xl border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-primary/20 transition-all duration-300">
                                    <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary mb-1 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                        <Lightbulb className="w-6 h-6" />
                                    </div>
                                    <h4 className="font-bold text-lg">Sistem Mimarisi</h4>
                                    <p className="text-sm text-muted-foreground leading-snug">Karmaşık yapıları sadeleştiren çözümler.</p>
                                </div>
                            </div>
                        </div>

                        {/* Sağ: Görsel / Soyut Yapı */}
                        <div className="relative h-full min-h-[450px] bg-gradient-to-br from-muted/50 to-background rounded-3xl border border-border/60 p-8 flex items-center justify-center overflow-hidden group shadow-xl">
                            {/* Arka Plan Efektleri (Aynı kalıyor) */}
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[length:32px_32px] group-hover:scale-105 transition-transform duration-1000"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>

                            {/* --- GÜNCELLENEN KISIM BAŞLANGICI --- */}
                            {/* Metin yerine görseller eklendi. z-10 ile öne çıkarıldı ve hover efekti eklendi. */}
                            <div className="relative z-10 flex flex-col items-center justify-center group-hover:opacity-75 transition-opacity duration-500 select-none">
                                <div className="w-100 h-110 flex items-center justify-center">
                                    <Image src="/940-logo.png" alt="940 Logo" quality={100} fill className="object-contain mb-4" />
                                </div>
                            </div>
                            {/* --- GÜNCELLENEN KISIM SONU --- */}
                        </div>

                    </div>
                </div>
            </section>

            {/* --- SYNAPSE (PRODUCT) --- */}
            <section className="py-24 bg-muted/10 border-y border-border/50 relative">
                <div className="container mx-auto px-4 md:px-6">

                    <div className="max-w-3xl mx-auto text-center mb-16 space-y-6">
                        <Badge variant="secondary" className="bg-background border-primary/20 text-primary px-4 py-1 animate-in fade-in zoom-in duration-700 delay-300 fill-mode-both">
                            AMİRAL GEMİSİ
                        </Badge>

                        {/* GÜNCELLEME: Font Hero ile eşitlendi */}
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
                            SYNAPSE
                        </h2>

                        <p className="text-xl md:text-2xl font-medium text-foreground/80">
                            Türkiye’nin Disiplinlerarası Proje Ekosistemi
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            Üniversite öğrencilerinin sahip olduğu entelektüel enerjiyi somut çıktılara dönüştürmek için tasarlanmış profesyonel üretim ağı.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Kart 1 */}
                        <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 group">
                            <CardHeader>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors border border-primary/10">
                                    <Network className="w-7 h-7 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Bağlantı Sanatı</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    İsmini sinir hücrelerinin etkileşim noktalarından alan SYNAPSE;
                                    mühendislikten sanata, sağlıktan sosyal bilimlere kadar farklı branşları
                                    tek bir dijital çatı altında buluşturur.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Kart 2 */}
                        <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 group">
                            <CardHeader>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors border border-primary/10">
                                    <Globe className="w-7 h-7 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Ekosistem Odaklılık</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    Bireysel çabaları kolektif bir güce dönüştürüyoruz.
                                    Öğrencilerin uzmanlıklarını teknolojiyle entegre edebilecekleri
                                    hibrit ve canlı bir çalışma ortamı sunuyoruz.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Kart 3 */}
                        <Card className="bg-background/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5 group">
                            <CardHeader>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-primary/10 transition-colors border border-primary/10">
                                    <Layers className="w-7 h-7 text-primary" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Sistematik Altyapı</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed text-base">
                                    Biz sistemin algoritmasını ve vizyonel rotasını belirliyoruz.
                                    Katılımcılarımızın ise sadece üretmeye, keşfetmeye ve geleceği
                                    tasarlamaya odaklanmalarını sağlıyoruz.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </section>

            {/* --- VİZYON & GELECEK --- */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="bg-gradient-to-br from-primary/5 via-background to-primary/5 rounded-[2.5rem] p-8 md:p-20 text-center border border-primary/10 relative overflow-hidden group shadow-2xl">

                        <div className="relative  max-w-4xl mx-auto space-y-8">
                            <div className="bg-background w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-lg border border-primary/10 group-hover:scale-110 transition-transform duration-500">
                                <Cpu className="w-10 h-10 text-primary" />
                            </div>

                            {/* GÜNCELLEME: Font Hero ile eşitlendi */}
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                                Geleceği Birlikte Şekillendiriyoruz
                            </h2>

                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                                Dünya artık sadece dar uzmanlık alanlarıyla değil, bu alanların birbiriyle kurduğu
                                güçlü bağlarla dönüşüyor. <strong>940 Solutions</strong> olarak biz, bu bağların mimarlığını yapıyoruz.
                            </p>

                            <p className="text-lg md:text-xl text-muted-foreground">
                                Genç yeteneklerin vizyonunu profesyonel bir altyapı ile destekliyor;
                                ülkemizin teknoloji üretim kapasitesine tabandan tavana yayılan,
                                nitelikli ve özgün bir katkı sağlamayı amaçlıyoruz.
                            </p>
                        </div>

                        {/* Arkaplan Efekti */}
                        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[100px] opacity-60 group-hover:opacity-80 transition-opacity duration-1000"></div>
                        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] opacity-60 group-hover:opacity-80 transition-opacity duration-1000"></div>
                    </div>
                </div>
            </section>

            <Footer />

        </div>
    );
}