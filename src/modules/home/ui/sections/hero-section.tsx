import {Search} from "lucide-react";
import {Button} from "@/components/ui/button";

export const HeroSection = () => {
    return (
        <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-4">
            <div className="container mx-auto max-w-6xl text-center">

                {/* Badge / Etiket */}
                <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium mb-8 animate-in fade-in zoom-in duration-500">
                    <span className="relative flex h-2 w-2">
                        <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    AYBU Öğrencileri İçin Yayında
                </div>

                {/* Ana Başlık */}
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-foreground">
                    Fikirlerinizi{" "}
                    <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-cyan-400">
                        Projeye
                    </span>
                    ,<br/>
                    Projelerinizi{" "}
                    <span className="text-foreground relative inline-block">
                        Geleceğe
                        <svg
                            className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-60"
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
                    </span>{" "}
                    Dönüştürün.
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Synapse, AYBU öğrencilerinin proje fikirlerini paylaştığı, takım
                    arkadaşları bulduğu ve sektörle buluştuğu yeni nesil işbirliği
                    platformudur.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        size="lg"
                        className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-bold"
                    >
                        <Search className="w-5 h-5 mr-2"/>
                        Projeleri Keşfet
                    </Button>
                    <Button variant="ghost" size="lg" className="rounded-full">
                        Proje Fikri Ekle
                    </Button>
                </div>

                {/* İstatistikler / Social Proof */}
                <div className="mt-16 pt-8 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        {label: "Aktif Proje", val: "150+"},
                        {label: "Öğrenci", val: "2.5k+"},
                        {label: "Akademisyen", val: "40+"},
                        {label: "Destekleyen Kurum", val: "12"},
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-foreground mb-1">
                                {stat.val}
                            </span>
                            <span className="text-sm text-muted-foreground uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};