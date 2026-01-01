import {ProfileSidebar} from "@/modules/profile/ui/components/profile/profile-sidebar";
import {CURRENT_USER} from "@/lib/data";
import {ProfileContent} from "@/modules/profile/ui/components/profile/profile-content";

export const ProfileView = () => {
    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

            {/* Sayfa Başlığı (Opsiyonel) */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Profilim</h1>
                <p className="text-muted-foreground">Kişisel bilgilerinizi, projelerinizi ve deneyimlerinizi yönetin.</p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* SOL SÜTUN (Sticky Sidebar) - 4 Birim */}
                <div className="lg:col-span-4 lg:sticky lg:top-8">
                    <ProfileSidebar user={CURRENT_USER} />
                </div>

                {/* SAĞ SÜTUN (İçerik) - 8 Birim */}
                <div className="lg:col-span-8">
                    <ProfileContent user={CURRENT_USER} />
                </div>

            </div>
        </div>
    );
};