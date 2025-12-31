"use client";

import {useState} from "react";
import {Plus} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {ProjectCard} from "@/modules/dashboard/ui/components/projects/project-card";
import {CreateProjectDialog} from "@/modules/dashboard/ui/components/projects/create-project-dialog";
import {ProjectsFilterBar} from "@/modules/dashboard/ui/components/projects/projects-filter-bar";
import {ProjectsAdvancedFilter} from "@/modules/dashboard/ui/components/projects/projects-advanced-filter";
import {MOCK_MY_PROJECTS} from "@/lib/data";

export const ProjectsView = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Yeni Filtreler
    const [selectedCompetition, setSelectedCompetition] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "ongoing">("all");

    // --- LOGIC ---
    const toggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    // FİLTRELEME MANTIĞI
    const filteredProjects = MOCK_MY_PROJECTS.filter((p) => {
        // 1. Metin Araması
        const query = searchQuery.toLocaleLowerCase("tr");
        const titleMatches = p.title.toLocaleLowerCase("tr").includes(query);

        // 2. Yarışma Filtresi
        const compMatches = selectedCompetition
            ? p.competition === selectedCompetition
            : true;

        // 3. Durum Filtresi (Tamamlandı / Devam Ediyor)
        const statusMatches = statusFilter === "all"
            ? true
            : p.status === statusFilter;

        return titleMatches && compMatches && statusMatches;
    }).sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

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
                    <div
                        className="text-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
                        Henüz bu kriterlere uygun bir projen yok.
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} currentUserId={1}/>
                    ))
                )}
            </div>

            {/* --- PAGINATION --- */}
            <div className="flex justify-center mt-8">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#"/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#"/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};