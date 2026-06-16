import { Users, Video, Building2 } from "lucide-react";

export const FeaturesSection = () => {
    return (
        <section id="ozellikler" className="py-20 md:py-32 bg-background/50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Potansiyelini Ateşle</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">Synapse, bir fikir aşamasından nihai ürüne kadar ihtiyacın olan tüm araçları sunar.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="group p-8 rounded-3xl bg-card/50 border border-border hover:border-violet-500/50 hover:bg-card transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-12 h-12 bg-violet-900/30 rounded-2xl flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">Takımını Kur</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Ekip arkadaşı mı arıyorsun? Profil oluştur, yeteneklerini sergile ve hayalindeki ekibi topla.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group p-8 rounded-3xl bg-card/50 border border-border hover:border-cyan-500/50 hover:bg-card transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-12 h-12 bg-cyan-900/30 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                            <Video className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">Canlı İşbirliği</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Platform içi mesajlaşma ve yüksek kaliteli görüntülü görüşme ile takımınla her an senkronize kal.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group p-8 rounded-3xl bg-card/50 border border-border hover:border-pink-500/50 hover:bg-card transition-all duration-300 relative overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="w-12 h-12 bg-pink-900/30 rounded-2xl flex items-center justify-center mb-6 text-pink-400 group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">Kurumsal Destek</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Projelerin, sektördeki öncü firmalar ve akademisyenler tarafından incelensin, mentorluk ve destek al.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
