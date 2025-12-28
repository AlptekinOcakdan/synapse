export const CTASection = () => {
    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-3xl bg-linear-to-r from-violet-900 to-indigo-900 overflow-hidden px-6 py-16 md:px-16 text-center">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-30"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-violet-500 rounded-full blur-[100px] opacity-30"></div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Fikrin Var mı?</h2>
                        <p className="text-violet-100 text-lg mb-8">
                            Hemen profilini oluştur, SYNAPSE&apos;a katıl ve hayalindeki projeyi gerçeğe dönüştürmek için ilk adımı at.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-white text-violet-900 rounded-full font-bold hover:bg-violet-50 transition-all shadow-xl shadow-violet-900/20">
                                Hemen Kayıt Ol
                            </button>
                            <button className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-medium hover:bg-white/10 transition-all">
                                Daha Fazla Bilgi
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};