import {HomeNavigationBar} from "@/modules/home/ui/components/home-navigation-bar";
import {BackgroundEffects} from "@/modules/home/ui/components/background-effects";
import {HeroSection} from "@/modules/home/ui/sections/hero-section";
import {FeaturesSection} from "@/modules/home/ui/sections/features-section";
import {DashboardPreviewSection} from "@/modules/home/ui/sections/dashboard-preview-section";
import {CTASection} from "@/modules/home/ui/sections/cta-section";
import {Footer} from "@/modules/home/ui/sections/footer-section";

export const HomeView = () => {
    return (
        <div className="min-h-dvh bg-slate-950 text-slate-200 font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
            <BackgroundEffects />
            <HomeNavigationBar />

            <main>
                <HeroSection />
                <FeaturesSection />
                <DashboardPreviewSection />
                <CTASection />
            </main>

            <Footer />
        </div>
    )
}