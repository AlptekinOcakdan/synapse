"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AcademicianCard } from "../components/academics/academician-card";

// --- CONVEX IMPORTS ---
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export const AcademiciansView = () => {
    // --- STATE ---
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

    // --- DATA FETCHING ---
    // 1. Akademisyenleri Çek (Filtreler ile)
    const academicians = useQuery(api.users.getAcademicians, {
        searchQuery: searchQuery,
        department: selectedDepartment
    });

    // 2. Bölümleri Çek (Dinamik Liste)
    const departmentsData = useQuery(api.users.getDepartments);
    const departments = departmentsData || [];

    // --- LOADING STATE ---
    if (academicians === undefined) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-full px-4 py-6">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Uzman Havuzu</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        Projeleriniz için uzman mentörler bulun, araştırma alanlarına göre uzmanları keşfedin ve iletişime geçin.
                    </p>
                </div>
            </div>

            {/* --- FILTERS --- */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="İsim veya araştırma alanı ara..."
                        className="pl-9 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full sm:w-62.5">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground" />
                            <SelectValue placeholder="Bölüm Seçiniz" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tüm Bölümler</SelectItem>
                        {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Separator />

            {/* --- GRID LIST --- */}
            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-6">
                {academicians.length > 0 ? (
                    academicians.map((academician) => (
                        <AcademicianCard key={academician.id} academician={academician} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        <p>Aradığınız kriterlere uygun akademisyen bulunamadı.</p>
                        <Button
                            variant="link"
                            onClick={() => {setSearchQuery(""); setSelectedDepartment("all");}}
                        >
                            Filtreleri Temizle
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};