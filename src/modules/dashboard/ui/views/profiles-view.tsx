"use client";

import { useState } from "react";
import { Search, Loader2, ArrowDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "../components/profiles/profile-card";
import { ProfileFilterBar } from "../components/profiles/profile-filter-bar";

// --- CONVEX IMPORTS ---
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const ITEMS_PER_PAGE = 8; // Sayfa başına profil sayısı

export const ProfilesView = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    // --- CONVEX QUERY ---
    const { results, status, loadMore } = usePaginatedQuery(
        api.users.getProfiles,
        {
            searchQuery: searchQuery,
            departments: selectedDepartments,
            skills: selectedSkills,
        },
        { initialNumItems: ITEMS_PER_PAGE }
    );

    // Results (results undefined olabilir, boş dizi fallback'i veriyoruz)
    const profiles = results || [];

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

            {/* --- FILTER BAR --- */}
            <ProfileFilterBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDepartments={selectedDepartments}
                setSelectedDepartments={setSelectedDepartments}
                selectedSkills={selectedSkills}
                setSelectedSkills={setSelectedSkills}
            />

            <Separator className="bg-border/50" />

            {/* --- LOADING STATE (İLK YÜKLEME) --- */}
            {status === "LoadingFirstPage" ? (
                <div className="flex h-40 w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {/* --- GRID LAYOUT --- */}
                    <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
                        {profiles.length > 0 ? (
                            profiles.map((profile) => (
                                <ProfileCard key={profile.id} profile={profile} />
                            ))
                        ) : (
                            // SONUÇ BULUNAMADI EKRANI
                            <div className="col-span-full py-20 text-center space-y-4 bg-muted/10 rounded-xl border border-dashed">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                                    <Search className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium">Sonuç Bulunamadı</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        Aradığınız kriterlere uygun bir profil bulamadık.
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

                    {/* --- LOAD MORE BUTTON --- */}
                    <div className="flex justify-center mt-8 pb-10">
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
                                        Daha Fazla Profil <ArrowDown className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};