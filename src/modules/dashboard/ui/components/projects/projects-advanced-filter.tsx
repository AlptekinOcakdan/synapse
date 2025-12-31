"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronsUpDown, Trophy, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock Yarışma Listesi
const COMPETITIONS = [
    "Teknofest",
    "TÜBİTAK 2209-A",
    "TÜBİTAK 2209-B",
    "Hackathon",
    "Global Game Jam",
    "Solution Challenge"
];

type ProjectStatusFilterType = "all" | "completed" | "ongoing";

interface MyProjectsAdvancedFilterProps {
    isOpen: boolean;
    selectedCompetition: string;
    setSelectedCompetition: (val: string) => void;
    statusFilter: "all" | "completed" | "ongoing";
    setStatusFilter: (val: ProjectStatusFilterType) => void;
}

export const ProjectsAdvancedFilter = ({
                                             isOpen,
                                             selectedCompetition,
                                             setSelectedCompetition,
                                             statusFilter,
                                             setStatusFilter,
                                         }: MyProjectsAdvancedFilterProps) => {

    const [openComp, setOpenComp] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="bg-muted/30 border rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* 1. YARIŞMA SEÇİMİ */}
                        <div className="space-y-2 flex flex-col">
                            <Label className="flex items-center gap-2 text-sm font-semibold">
                                <Trophy className="w-4 h-4 text-primary" /> Yarışma
                            </Label>
                            <Popover open={openComp} onOpenChange={setOpenComp}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openComp}
                                        className="w-full justify-between font-normal bg-background"
                                    >
                                        {selectedCompetition || "Yarışma seç..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Yarışma ara..." />
                                        <CommandList>
                                            <CommandEmpty>Yarışma bulunamadı.</CommandEmpty>
                                            <CommandGroup>
                                                {COMPETITIONS.map((comp) => (
                                                    <CommandItem
                                                        key={comp}
                                                        value={comp}
                                                        onSelect={(currentValue) => {
                                                            setSelectedCompetition(currentValue === selectedCompetition ? "" : currentValue);
                                                            setOpenComp(false);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedCompetition === comp ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {comp}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {selectedCompetition && (
                                <Badge variant="secondary" className="w-fit cursor-pointer" onClick={() => setSelectedCompetition("")}>
                                    {selectedCompetition} X
                                </Badge>
                            )}
                        </div>

                        {/* 2. DURUM FİLTRESİ */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-sm font-semibold">
                                <Activity className="w-4 h-4 text-primary" /> Proje Durumu
                            </Label>
                            <Select
                                value={statusFilter}
                                onValueChange={(val) => setStatusFilter(val as ProjectStatusFilterType)}
                            >
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Durum seç" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Hepsi</SelectItem>
                                    <SelectItem value="ongoing">Devam Ediyor</SelectItem>
                                    <SelectItem value="completed">Tamamlandı</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};