"use client";

import { Search, SortAsc, SortDesc, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MyProjectsFilterBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortOrder: "asc" | "desc";
    toggleSort: () => void;
    isAdvancedOpen: boolean;
    toggleAdvanced: () => void;
}

export const ProjectsFilterBar = ({
                                        searchQuery,
                                        setSearchQuery,
                                        sortOrder,
                                        toggleSort,
                                        isAdvancedOpen,
                                        toggleAdvanced,
                                    }: MyProjectsFilterBarProps) => {
    return (
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center w-full">
            <div className="relative w-full lg:w-96 shrink-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Projelerimde ara..."
                    className="pl-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-2 sm:flex gap-2">
                <Button
                    variant="outline"
                    onClick={toggleSort}
                    className="w-full sm:w-fit justify-center"
                >
                    {sortOrder === "desc" ? (
                        <>
                            <SortDesc className="w-4 h-4 mr-2 shrink-0" />
                            <span className="truncate">Yeniden Eskiye</span>
                        </>
                    ) : (
                        <>
                            <SortAsc className="w-4 h-4 mr-2 shrink-0" />
                            <span className="truncate">Eskiden Yeniye</span>
                        </>
                    )}
                </Button>

                <Button
                    variant={isAdvancedOpen ? "secondary" : "outline"}
                    onClick={toggleAdvanced}
                    className="w-full sm:w-fit justify-center"
                >
                    <Filter className="w-4 h-4 mr-2 shrink-0" />
                    <span className="truncate">Filtrele</span>
                </Button>
            </div>
        </div>
    );
};