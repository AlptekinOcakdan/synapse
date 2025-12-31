"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ProfileCard } from "../components/profiles/profile-card";
import { ProfileFilterBar } from "../components/profiles/profile-filter-bar";
import {MOCK_PROFILES} from "@/lib/data";

export const ProfilesView = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // --- FİLTRELEME MANTIĞI ---
    const filteredProfiles = MOCK_PROFILES.filter(p => {
        // 1. İsim veya Unvan Araması
        const query = searchQuery.toLocaleLowerCase("tr");
        const nameMatch = p.name.toLocaleLowerCase("tr").includes(query);
        const titleMatch = p.title.toLocaleLowerCase("tr").includes(query);
        const textMatch = nameMatch || titleMatch;

        const deptMatch = selectedDepartments.length === 0 || selectedDepartments.includes(p.department);

        const skillMatch = selectedSkills.length === 0 || p.skills.some(profileSkill =>
            selectedSkills.some(searchSkill =>
                profileSkill.toLowerCase().includes(searchSkill.toLowerCase())
            )
        );

        return textMatch && deptMatch && skillMatch;
    });

    return (
        <div className="space-y-8 w-full px-4 py-8">

            {/* --- HEADER --- */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                    Yıldızlar Karması
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
                    Topluluğumuzun en yetenekli geliştiricilerini, tasarımcılarını ve mühendislerini keşfet.
                </p>
            </div>

            {/* --- FILTER BAR (Yeni Bileşen) --- */}
            <ProfileFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDepartments={selectedDepartments}
                setSelectedDepartments={setSelectedDepartments}
                selectedSkills={selectedSkills}
                setSelectedSkills={setSelectedSkills}
            />

            <Separator className="bg-border/50" />

            {/* --- GRID LAYOUT --- */}
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6">
                {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-4 bg-muted/10 rounded-xl border border-dashed">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                            <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Sonuç Bulunamadı</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Aradığınız kriterlere uygun bir profil bulamadık. Lütfen filtrelerinizi gevşetmeyi veya farklı terimler kullanmayı deneyin.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedDepartments([]);
                                setSelectedSkills([]);
                            }}
                            className="text-primary font-medium hover:underline"
                        >
                            Filtreleri Temizle
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};