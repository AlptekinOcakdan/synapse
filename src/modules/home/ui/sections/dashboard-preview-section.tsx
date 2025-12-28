import { Video } from "lucide-react";

export const DashboardPreviewSection = () => {
    return (
        <section className="py-20 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-4 md:p-8 backdrop-blur-sm">
                    <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-violet-500/5 to-transparent rounded-2xl pointer-events-none"></div>

                    {/* Fake Browser UI */}
                    <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                        <div className="flex-1 bg-slate-950/50 rounded-md py-1 px-3 text-xs text-slate-500 text-center font-mono">
                            synapse.aybu.edu.tr/proje/detay
                        </div>
                    </div>

                    {/* Content Mockup */}
                    <div className="grid md:grid-cols-4 gap-6 opacity-90">
                        {/* Sidebar Mockup */}
                        <div className="hidden md:flex flex-col gap-4">
                            <div className="h-10 w-32 bg-slate-800 rounded-lg animate-pulse"></div>
                            <div className="h-4 w-24 bg-slate-800/50 rounded animate-pulse"></div>
                            <div className="h-4 w-20 bg-slate-800/50 rounded animate-pulse"></div>
                            <div className="h-4 w-28 bg-slate-800/50 rounded animate-pulse"></div>
                        </div>

                        {/* Main Content Mockup */}
                        <div className="md:col-span-3 space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Kampüs: Projem</h3>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-300 text-xs">Mühendislik</span>
                                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs">Yapay Zeka</span>
                                    </div>
                                </div>
                                <button className="bg-violet-600 px-4 py-2 rounded-lg text-sm text-white">Başvur</button>
                            </div>
                            <div className="h-32 bg-slate-800/30 rounded-xl border border-slate-800 p-4 flex gap-4 items-center justify-center">
                                <div className="text-slate-500 text-sm flex flex-col items-center gap-2">
                                    <Video className="w-8 h-8 opacity-50" />
                                    <span className="opacity-50">Görüntülü Görüşme Paneli</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-20 bg-slate-800/50 rounded-lg"></div>
                                <div className="h-20 bg-slate-800/50 rounded-lg"></div>
                                <div className="h-20 bg-slate-800/50 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};