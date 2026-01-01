"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MOCK_ACADEMICIANS, DEPARTMENTS } from "@/lib/data"; // Verileri import et
import { AcademicianCard } from "../components/academics/academician-card";

export const AcademiciansView = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

    // Filtreleme Mantığı
    const filteredAcademicians = MOCK_ACADEMICIANS.filter((academician) => {
        const matchesSearch =
            academician.name.toLocaleLowerCase("tr").includes(searchQuery.toLocaleLowerCase("tr")) ||
            academician.researchInterests.some(tag => tag.toLocaleLowerCase("tr").includes(searchQuery.toLocaleLowerCase("tr")));

        const matchesDept = selectedDepartment === "all" || academician.department === selectedDepartment;

        return matchesSearch && matchesDept;
    });

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
                        {DEPARTMENTS.map((dept) => (
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
                {filteredAcademicians.length > 0 ? (
                    filteredAcademicians.map((academician) => (
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