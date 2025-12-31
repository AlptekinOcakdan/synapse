"use client";

import {useState} from "react";
import {Separator} from "@/components/ui/separator";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {ProjectCard} from "../components/dashboard/project-card";
import {ProjectsFilterBar} from "../components/dashboard/projects-filter-bar";
import {AdvancedSearchPanel} from "../components/dashboard/advanced-search-panel";
import {MOCK_PROJECTS} from "@/lib/data";

export const DashboardView = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

    // Gelişmiş filtre state'leri
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [skills, setSkills] = useState<string[]>([]);

    // --- LOGIC ---
    const toggleSort = () => {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
    };

    // FİLTRELEME MANTIĞI
    const filteredProjects = MOCK_PROJECTS.filter((p) => {
        // 1. Metin Araması (Başlık veya Sahip)
        const query = searchQuery.toLocaleLowerCase("tr");
        const title = p.title.toLocaleLowerCase("tr");
        const owner = p.owner.name.toLocaleLowerCase("tr");
        const matchesSearch = title.includes(query) || owner.includes(query);

        // 2. Bölüm Filtresi (Positions dizisi içinde arar)
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

    return (
        <div className="space-y-6 max-w-full px-4 py-6">

            {/* --- HEADER --- */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Projeler</h1>
                <p className="text-muted-foreground mt-2">
                    Yenilikçi projelere göz at, takım arkadaşı ol veya kendi projeni paylaş.
                </p>
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

                <AdvancedSearchPanel
                    isOpen={isAdvancedOpen}
                    selectedDepartment={selectedDepartment}
                    setSelectedDepartment={setSelectedDepartment}
                    skills={skills}
                    setSkills={setSkills}
                />
            </div>

            <Separator />

            {/* --- PROJECTS LIST --- */}
            <div className="space-y-4">
                {filteredProjects.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        Aradığınız kriterlere uygun proje bulunamadı.
                    </div>
                ) : (
                    filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))
                )}
            </div>

            {/* --- PAGINATION --- */}
            <div className="flex justify-center mt-8">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};