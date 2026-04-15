import { LayoutProps } from "@/lib/utils";
import { SynapseLogo } from "@/components/synapse-logo";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: LayoutProps) => {
    const session = await getSession();

    if (!session || session.role !== "admin") {
        redirect("/dashboard");
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="h-16 border-b border-border flex items-center px-6">
                <SynapseLogo />
                <span className="ml-4 text-sm text-muted-foreground font-medium">Yönetim Paneli</span>
            </header>
            <main className="p-6">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
