"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // Buton eklendi
import { ProjectCard } from "../components/dashboard/project-card";
import { ProjectsFilterBar } from "../components/dashboard/projects-filter-bar";
import { AdvancedSearchPanel } from "../components/dashboard/advanced-search-panel";
import { ProjectDetailsDialog } from "@/modules/dashboard/ui/components/dashboard/project-details-dialog";
import { Loader2, ArrowDown } from "lucide-react";

// --- CONVEX IMPORTS ---
import { usePaginatedQuery, useQuery } from "convex/react";
import {api} from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const ITEMS_PER_PAGE = 6; // İlk açılışta ve her yüklemede kaç tane gelsin

export const DashboardView = () => {
    // --- URL STATE ---
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const selectedProjectId = searchParams.get("projectId");

    // --- CONVEX PAGINATION ---
    // usePaginatedQuery bize 'results' (şu ana kadar yüklenenler), 'status' ve 'loadMore' verir.
    const { results, status, loadMore } = usePaginatedQuery(
        api.projects.getProjects,
        {}, // Argümanlar (varsa)
        { initialNumItems: ITEMS_PER_PAGE } // Başlangıç sayısı
    );

    // Modal verisi
    const selectedProjectData = useQuery(
        api.projects.getProject,
        selectedProjectId ? { id: selectedProjectId as Id<"projects"> } : "skip"
    );

    const handleCloseDialog = (open: boolean) => {
        if (!open) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("projectId");
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    // --- NORMAL STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [skills, setSkills] = useState<string[]>([]);

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    // --- FİLTRELEME MANTIĞI ---
    // Filtreleme şu an "yüklenmiş veriler" üzerinde çalışır.
    const filteredProjects = useMemo(() => {
        // results undefined ise boş dizi
        const currentProjects = results || [];

        return currentProjects.filter((p) => {
            const query = searchQuery.toLocaleLowerCase("tr");
            const title = p.title.toLocaleLowerCase("tr");
            const ownerName = p.owner?.name?.toLocaleLowerCase("tr") || "";

            const matchesSearch = title.includes(query) || ownerName.includes(query);

            let matchesDept = true;
            if (selectedDepartment) {
                matchesDept = p.positions.some((pos) => pos.department === selectedDepartment);
            }

            let matchesSkills = true;
            if (skills.length > 0) {
                matchesSkills = p.positions.some((pos) => {
                    const positionSkills = pos.skills.map(s => s.toLowerCase());
                    return skills.some(searchSkill => positionSkills.includes(searchSkill.toLowerCase()));
                });
            }

            return matchesSearch && matchesDept && matchesSkills;
        }).sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        });
    }, [results, searchQuery, sortOrder, selectedDepartment, skills]);


    // --- YÜKLENİYOR DURUMU (İlk Yükleme) ---
    if (status === "LoadingFirstPage") {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-full px-4 py-6">
            {/* --- MODAL --- */}
            {selectedProjectId && selectedProjectData && (
                <ProjectDetailsDialog
                    project={selectedProjectData}
                    open={true}
                    onOpenChange={handleCloseDialog}
                />
            )}

            {/* --- HEADER --- */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>
                <p className="text-muted-foreground mt-2">
                    Yenilikçi projelere göz at, takım arkadaşı ol veya kendi projeni paylaş.
                </p>
            </div>

            {/* --- FILTER --- */}
            <div className="flex flex-col gap-4">
                <ProjectsFilterBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortOrder={sortOrder}
                    toggleSort={toggleSort}
                    isAdvancedOpen={isAdvancedOpen}
                    toggleAdvanced={() => setIsAdvancedOpen(!isAdvancedOpen)}
                />

                <AdvancedSearchPanel
                    isOpen={isAdvancedOpen}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                    skills={skills}
                    setSkills={setSkills}
                />
            </div>

            <Separator />

            {/* --- LİSTE --- */}
            <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        {status === "Exhausted"
                            ? "Aradığınız kriterlere uygun proje bulunamadı."
                            : "Projeler yükleniyor..."}
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>

            {/* --- PAGINATION (LOAD MORE) --- */}
            <div className="flex justify-center mt-8 pb-10">
                {/* DÜZELTME BURADA: Statü "CanLoadMore" VEYA "LoadingMore" ise butonu göster */}
                {(status === "CanLoadMore" || status === "LoadingMore") && (
                    <Button
                        onClick={() => loadMore(ITEMS_PER_PAGE)}
                        disabled={status === "LoadingMore"}
                        variant="outline"
                        className="w-full max-w-xs"
                    >
                        {status === "LoadingMore" ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...
                            </>
                        ) : (
                            <>
                                Daha Fazla Göster <ArrowDown className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                )}

                {/* Tümü Yüklendi Mesajı */}
                {status === "Exhausted" && filteredProjects.length > 0 && (
                    <p className="text-xs text-muted-foreground">Tüm projeler listelendi.</p>
                )}
            </div>
        </div>
    );
};