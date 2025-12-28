import { Search } from "lucide-react";

export const HeroSection = () => {
    return (
        <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-4">
            <div className="container mx-auto max-w-6xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs md:text-sm font-medium mb-8 animate-in fade-in zoom-in duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
                    AYBU Öğrencileri İçin Yayında
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                    Fikirlerinizi <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 to-cyan-400">Projeye</span>,<br />
                    Projelerinizi <span className="text-white relative">
            Geleceğe
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-violet-600 opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00025 6.99997C25.7538 5.61749 59.8559 1.70111 120.943 3.96839C168.125 5.71966 195.918 5.71966 197.943 6.99997" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
          </span> Dönüştürün.
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Synapse, AYBU öğrencilerinin proje fikirlerini paylaştığı, takım arkadaşları bulduğu ve sektörle buluştuğu yeni nesil işbirliği platformudur.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                        <Search className="w-5 h-5" />
                        Projeleri Keşfet
                    </button>
                    <button className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-full font-medium hover:bg-slate-700 transition-all flex items-center justify-center gap-2">
                        Proje Fikri Ekle
                    </button>
                </div>

                {/* Stats / Social Proof */}
                <div className="mt-16 pt-8 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: 'Aktif Proje', val: '150+' },
                        { label: 'Öğrenci', val: '2.5k+' },
                        { label: 'Akademisyen', val: '40+' },
                        { label: 'Destekleyen Kurum', val: '12' },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-white mb-1">{stat.val}</span>
                            <span className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};