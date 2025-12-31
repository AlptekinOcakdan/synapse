"use client";

import {SVGProps, useState} from "react";
import { Search, GraduationCap, Award, Check, X, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {DEPARTMENTS} from "@/lib/data";

interface ProfileFilterBarProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    selectedDepartments: string[];
    setSelectedDepartments: (val: string[]) => void;
    selectedSkills: string[];
    setSelectedSkills: (val: string[]) => void;
}

export const ProfileFilterBar = ({
                                     searchQuery,
                                     setSearchQuery,
                                     selectedDepartments,
                                     setSelectedDepartments,
                                     selectedSkills,
                                     setSelectedSkills,
                                 }: ProfileFilterBarProps) => {

    const [isDeptOpen, setIsDeptOpen] = useState(false);
    const [skillInput, setSkillInput] = useState("");

    // --- HANDLERS ---

    // Bölüm Ekle/Çıkar
    const toggleDepartment = (value: string) => {
        if (selectedDepartments.includes(value)) {
            setSelectedDepartments(selectedDepartments.filter((d) => d !== value));
        } else {
            setSelectedDepartments([...selectedDepartments, value]);
        }
    };

    // Yetenek Ekle
    const addSkill = () => {
        const trimmed = skillInput.trim();
        if (trimmed && !selectedSkills.includes(trimmed)) {
            setSelectedSkills([...selectedSkills, trimmed]);
            setSkillInput("");
        }
    };

    // Yetenek Çıkar
    const removeSkill = (skill: string) => {
        setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    };

    return (
        <div className="space-y-4 bg-muted/30 p-4 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">Filtreleme Seçenekleri</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 1. İSİM ARAMA (Col-Span 4) */}
                <div className="lg:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground">İsim veya Unvan</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Profil ara..."
                            className="pl-9 bg-background"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* 2. ÇOKLU BÖLÜM SEÇİMİ (Col-Span 4) */}
                <div className="lg:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> Bölümler
                    </Label>

                    <Popover open={isDeptOpen} onOpenChange={setIsDeptOpen}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-between bg-background text-muted-foreground font-normal">
                                {selectedDepartments.length > 0
                                    ? `${selectedDepartments.length} bölüm seçildi`
                                    : "Bölüm seçiniz..."}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-75 p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Bölüm ara..." />
                                <CommandList>
                                    <CommandEmpty>Bölüm bulunamadı.</CommandEmpty>
                                    <CommandGroup>
                                        {DEPARTMENTS.map((dept) => (
                                            <CommandItem
                                                key={dept.value}
                                                value={dept.label}
                                                onSelect={() => toggleDepartment(dept.value)}
                                            >
                                                <div className={cn(
                                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                    selectedDepartments.includes(dept.value)
                                                        ? "bg-primary text-primary-foreground"
                                                        : "opacity-50 [&_svg]:invisible"
                                                )}>
                                                    <Check className={cn("h-4 w-4")} />
                                                </div>
                                                {dept.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {/* Seçilen Bölümleri Listeleme Alanı */}
                    {selectedDepartments.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedDepartments.map((deptVal) => {
                                const label = DEPARTMENTS.find(d => d.value === deptVal)?.label || deptVal;
                                return (
                                    <Badge key={deptVal} variant="secondary" className="px-2 py-0.5 text-xs bg-background border">
                                        {label}
                                        <button
                                            onClick={() => toggleDepartment(deptVal)}
                                            className="ml-1 hover:text-destructive focus:outline-none"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                )
                            })}
                            <button
                                onClick={() => setSelectedDepartments([])}
                                className="text-[10px] text-muted-foreground hover:text-primary underline px-1"
                            >
                                Temizle
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. ÇOKLU YETENEK GİRİŞİ (Col-Span 4) */}
                <div className="lg:col-span-4 space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" /> Uzmanlık Alanları
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Yetenek yaz (React, Java)..."
                            className="bg-background flex-1"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addSkill()}
                        />
                        <Button size="icon" variant="outline" onClick={addSkill} className="shrink-0">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Seçilen Yetenekleri Listeleme */}
                    {selectedSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {selectedSkills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="px-2 py-0.5 text-xs bg-background border">
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="ml-1 hover:text-destructive focus:outline-none"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                            <button
                                onClick={() => setSelectedSkills([])}
                                className="text-[10px] text-muted-foreground hover:text-primary underline px-1"
                            >
                                Temizle
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

// İkon Helper
function ChevronsUpDownIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
        </svg>
    )
}