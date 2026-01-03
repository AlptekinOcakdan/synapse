"use client";

import { useState, useMemo } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// Pagination bileşenlerini kaldırdık çünkü "Projelerim" listesi genelde kısadır
// Eğer çok uzarsa DashboardView'daki gibi Load More yapısı kurabilirsin.
import { ProjectCard } from "@/modules/dashboard/ui/components/projects/project-card";
import { CreateProjectDialog } from "@/modules/dashboard/ui/components/projects/create-project-dialog";
import { ProjectsFilterBar } from "@/modules/dashboard/ui/components/projects/projects-filter-bar";
import { ProjectsAdvancedFilter } from "@/modules/dashboard/ui/components/projects/projects-advanced-filter";

// --- CONVEX IMPORTS ---
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const ProjectsView = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Yeni Filtreler
    const [selectedCompetition, setSelectedCompetition] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "ongoing">("all");

    // --- DATA FETCHING ---
    // Backend'den hem sahibi olunan hem de üye olunan projeleri çeker
    const myProjects = useQuery(api.projects.getMyProjects);

    // Kullanıcının kendi ID'sini çekmek (ProjectCard içinde yetki kontrolü için gerekebilir)
    // Şimdilik basitçe projeyi listelemeye odaklanıyoruz.

    // --- LOGIC ---
    const toggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    // FİLTRELEME MANTIĞI (Client-Side)
    const filteredProjects = useMemo(() => {
        if (!myProjects) return [];

        return myProjects.filter((p) => {
            // 1. Metin Araması
            const query = searchQuery.toLocaleLowerCase("tr");
            const titleMatches = p.title.toLocaleLowerCase("tr").includes(query);

            // 2. Yarışma Filtresi
            const compMatches = selectedCompetition
                ? p.competition === selectedCompetition
                : true;

            // 3. Durum Filtresi
            // Backend status string dönüyor, frontend enum bekliyor olabilir, string comparison yeterli
            const statusMatches = statusFilter === "all"
                ? true
                : p.status === statusFilter;

            return titleMatches && compMatches && statusMatches;
        }).sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
    }, [myProjects, searchQuery, selectedCompetition, statusFilter, sortOrder]);

    // --- LOADING STATE ---
    if (myProjects === undefined) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full px-4 py-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projelerim</h1>
                    <p className="text-muted-foreground mt-2">
                        Yönettiğin projeleri düzenle, ekibini kur ve yarışmalara hazırlan.
                    </p>
                </div>

                {/* SAĞ ÜST: YENİ PROJE BUTONU */}
                <CreateProjectDialog>
                    <Button className="shrink-0 gap-2">
                        <Plus className="w-4 h-4"/> Yeni Proje Oluştur
                    </Button>
                </CreateProjectDialog>
            </div>

            {/* --- FILTER SECTION --- */}
            <div className="flex flex-col gap-4">
                <ProjectsFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    isAdvancedOpen={isAdvancedOpen}
                    toggleAdvanced={() => setIsAdvancedOpen(!isAdvancedOpen)}
                />

                <ProjectsAdvancedFilter
                    isOpen={isAdvancedOpen}
                    selectedCompetition={selectedCompetition}
                    setSelectedCompetition={setSelectedCompetition}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                />
            </div>

            <Separator/>

            {/* --- PROJECTS LIST --- */}
            <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                        {searchQuery || selectedCompetition || statusFilter !== "all"
                            ? "Arama kriterlerine uygun proje bulunamadı."
                            : "Henüz bir projen yok veya bir projeye katılmadın."}
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))
                )}
            </div>
        </div>
    );
};