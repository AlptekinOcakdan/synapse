"use client";

import { useState } from "react";
import { Award, Check, ChevronsUpDown, GraduationCap, X, Plus } from "lucide-react"; // Plus ikonu eklendi
import { motion, AnimatePresence } from "framer-motion";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { DEPARTMENTS } from "../../../types";

interface AdvancedSearchPanelProps {
    isOpen: boolean;
    selectedDepartment: string;
    setSelectedDepartment: (dept: string) => void;
    skills: string[];
    setSkills: (skills: string[]) => void;
}

export const AdvancedSearchPanel = ({
                                        isOpen,
                                        selectedDepartment,
                                        setSelectedDepartment,
                                        skills,
                                        setSkills,
                                    }: AdvancedSearchPanelProps) => {

    const [skillInput, setSkillInput] = useState("");
    const [openDepartment, setOpenDepartment] = useState(false);

    // Ekleme mantığını ayırdık, hem butonda hem enter'da kullanacağız
    const handleAddSkill = () => {
        const trimmedInput = skillInput.trim();
        if (trimmedInput !== "") {
            if (!skills.includes(trimmedInput)) {
                setSkills([...skills, trimmedInput]);
            }
            setSkillInput("");
        }
    };

    // Klavye ile ekleme (Enter)
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="w-full bg-muted/30 border rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-6 justify-around">

                        {/* BÖLÜM SEÇİMİ */}
                        <div className="space-y-2 flex flex-col w-full">
                            <Label className="flex items-center gap-2 text-sm font-semibold">
                                <GraduationCap className="w-4 h-4 text-primary" /> Bölümün
                            </Label>

                            <Popover open={openDepartment} onOpenChange={setOpenDepartment}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openDepartment}
                                        className="w-full justify-between font-normal"
                                    >
                                        <span className="truncate mr-2">
                                            {selectedDepartment
                                                ? DEPARTMENTS.find((dept) => dept.value === selectedDepartment)?.label
                                                : "Bölümünü ara veya seç..."}
                                        </span>
                                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent align="start" className=" p-0">
                                    <Command
                                        filter={(value, search) => {
                                            if (value.toLocaleLowerCase("tr").includes(search.toLocaleLowerCase("tr"))) return 1;
                                            return 0;
                                        }}
                                    >
                                        <CommandInput placeholder="Bölüm ara..." />
                                        <CommandList>
                                            <ScrollArea className="h-56 sm:h-72">
                                                <CommandEmpty>Bölüm bulunamadı.</CommandEmpty>
                                                <CommandGroup>
                                                    {DEPARTMENTS.map((dept) => (
                                                        <CommandItem
                                                            key={dept.value}
                                                            value={dept.label}
                                                            onSelect={() => {
                                                                setSelectedDepartment(dept.value === selectedDepartment ? "" : dept.value);
                                                                setOpenDepartment(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedDepartment === dept.value ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {dept.label}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </ScrollArea>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* YETENEK GİRİŞİ */}
                        <div className="space-y-2 w-full">
                            <Label className="flex items-center gap-2 text-sm font-semibold">
                                <Award className="w-4 h-4 text-primary" /> Yetenekler
                            </Label>
                            <div className="bg-background px-3 py-2 rounded-md border border-input min-h-[42px] focus-within:ring-1 focus-within:ring-ring transition-all flex flex-col justify-center">
                                {/* Rozetler (Badges) */}
                                <div className="flex flex-wrap gap-2 mb-2 empty:mb-0">
                                    <AnimatePresence>
                                        {skills.map((skill) => (
                                            <motion.div
                                                key={skill}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                            >
                                                <Badge variant="secondary" className="pl-2 pr-1 py-1 gap-1 hover:bg-secondary/80 pointer-events-auto text-xs sm:text-sm">
                                                    {skill}
                                                    <div
                                                        className="ml-1 cursor-pointer p-0.5"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeSkill(skill);
                                                        }}
                                                    >
                                                        <X className="w-3 h-3 hover:text-destructive transition-colors relative z-10" />
                                                    </div>
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>

                                {/* Input ve Ekle Butonu */}
                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        className="bg-transparent border-none shadow-none focus-visible:ring-0 px-0 h-8 placeholder:text-muted-foreground/50 text-sm flex-1 min-w-[120px]"
                                        placeholder="Yetenek yaz..."
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={onKeyDown}
                                    />
                                    {/* MOBİL DOSTU EKLE BUTONU */}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                        onClick={handleAddSkill}
                                        disabled={!skillInput.trim()} // Boşsa tıklanamasın
                                        type="button"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span className="sr-only">Ekle</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};