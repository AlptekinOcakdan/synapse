"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    BarChart2,
    Download,
    GraduationCap,
    Layers,
    Loader2,
    TrendingUp,
    Users,
} from "lucide-react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type AreaEntry = { area: string; count: number };
type GroupEntry = {
    university: string;
    department: string;
    studentCount: number;
    areas: AreaEntry[];
};

// ---------------------------------------------------------------------------
// Excel export helper
// ---------------------------------------------------------------------------
function exportToExcel(groups: GroupEntry[]) {
    const rows: Record<string, string | number>[] = [];

    for (const g of groups) {
        for (const a of g.areas) {
            rows.push({
                Üniversite: g.university,
                Bölüm: g.department,
                "Öğrenci Sayısı (Grup)": g.studentCount,
                "Gelişim Alanı": a.area,
                "Tekrar Sayısı": a.count,
            });
        }
    }

    const ws = XLSX.utils.json_to_sheet(rows);

    // Sütun genişlikleri
    ws["!cols"] = [
        { wch: 36 },
        { wch: 30 },
        { wch: 22 },
        { wch: 30 },
        { wch: 16 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Gelişim Raporu");
    XLSX.writeFile(wb, "synapse-gelisim-raporu.xlsx");
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
function StatCard({
    icon: Icon,
    label,
    value,
    sub,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    sub?: string;
}) {
    return (
        <Card>
            <CardContent className="p-5 flex items-start gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                </span>
                <div>
                    <p className="text-2xl font-black tracking-tight">{value}</p>
                    <p className="text-sm font-medium text-foreground/80">{label}</p>
                    {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                </div>
            </CardContent>
        </Card>
    );
}

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------
export const ReportsView = () => {
    const data = useQuery(api.reports.getImprovementReport);

    if (data === undefined) {
        return (
            <div className="flex h-[60vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const { groups, totalStudents, totalEntries, topAreas } = data;

    // Kaç üniversite var
    const universitySet = new Set(groups.map((g) => g.university));

    return (
        <div className="max-w-6xl mx-auto space-y-8 px-4 py-8">
            {/* Başlık + Export */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gelişim Raporu</h1>
                    <p className="text-muted-foreground mt-1 text-sm max-w-xl">
                        Öğrencilerin belirttiği gelişim alanları; üniversite ve bölüm bazında
                        anonimleştirilmiş olarak gruplandırılmıştır.
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 shrink-0"
                    onClick={() => exportToExcel(groups)}
                    disabled={groups.length === 0}
                >
                    <Download className="w-4 h-4" />
                    Excel İndir
                </Button>
            </div>

            {/* Özet Kartlar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    label="Kayıtlı Öğrenci"
                    value={totalStudents}
                    sub="Gelişim alanı bildiren"
                />
                <StatCard
                    icon={GraduationCap}
                    label="Üniversite"
                    value={universitySet.size}
                    sub="Farklı kurum"
                />
                <StatCard
                    icon={Layers}
                    label="Bölüm Grubu"
                    value={groups.length}
                    sub="Üniversite × bölüm"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Toplam Giriş"
                    value={totalEntries}
                    sub="Gelişim alanı bildirimi"
                />
            </div>

            {/* En Çok Talep Edilen Alanlar */}
            {topAreas.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-primary" />
                            En Çok Bildirilen Gelişim Alanları
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            {topAreas.map((a, i) => {
                                const pct = Math.round((a.count / totalEntries) * 100);
                                return (
                                    <div key={a.area} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-muted-foreground w-4 text-right">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-sm font-medium">{a.area}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {a.count} bildirim · %{pct}
                                                </span>
                                            </div>
                                            <div className="w-full h-1.5 rounded-full bg-secondary">
                                                <div
                                                    className="h-1.5 rounded-full bg-primary transition-all"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Gruplu Tablo */}
            {groups.length === 0 ? (
                <div className="text-center py-20 rounded-xl border border-dashed text-muted-foreground">
                    <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Henüz gelişim alanı verisi bulunmuyor.</p>
                    <p className="text-sm mt-1">
                        Öğrenciler profil sayfasından gelişim alanlarını ekleyebilir.
                    </p>
                </div>
            ) : (
                <Accordion type="multiple" defaultValue={Array.from(universitySet)} className="space-y-3">
                    {Array.from(universitySet).map((uni) => {
                        const uniGroups = groups.filter((g) => g.university === uni);
                        const uniStudents = uniGroups.reduce((s, g) => s + g.studentCount, 0);

                        return (
                            <AccordionItem
                                key={uni}
                                value={uni}
                                className="border border-border rounded-xl overflow-hidden px-0"
                            >
                                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3 text-left">
                                        <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                                        <span className="font-semibold">{uni}</span>
                                        <Badge variant="secondary" className="text-[11px] font-normal">
                                            {uniStudents} öğrenci
                                        </Badge>
                                        <Badge variant="outline" className="text-[11px] font-normal">
                                            {uniGroups.length} bölüm
                                        </Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-0 pb-0">
                                    <div className="divide-y divide-border">
                                        {uniGroups.map((g) => (
                                            <div key={g.department} className="px-5 py-4 space-y-3">
                                                {/* Bölüm başlığı */}
                                                <div className="flex items-center gap-2">
                                                    <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                                                    <span className="text-sm font-semibold">{g.department}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        · {g.studentCount} öğrenci
                                                    </span>
                                                </div>

                                                {/* Alan tablosu */}
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-border/50">
                                                            <TableHead className="h-8 text-xs pl-0">Gelişim Alanı</TableHead>
                                                            <TableHead className="h-8 text-xs text-right pr-0 w-28">
                                                                Bildirim Sayısı
                                                            </TableHead>
                                                            <TableHead className="h-8 text-xs text-right pr-0 w-20">
                                                                Oran
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {g.areas.map((a) => {
                                                            const pct =
                                                                g.studentCount > 0
                                                                    ? Math.round((a.count / g.studentCount) * 100)
                                                                    : 0;
                                                            return (
                                                                <TableRow
                                                                    key={a.area}
                                                                    className="border-border/30"
                                                                >
                                                                    <TableCell className="py-2 pl-0 text-sm">
                                                                        {a.area}
                                                                    </TableCell>
                                                                    <TableCell className="py-2 text-right pr-0 text-sm font-medium tabular-nums">
                                                                        {a.count}
                                                                    </TableCell>
                                                                    <TableCell className="py-2 text-right pr-0">
                                                                        <Badge
                                                                            variant="outline"
                                                                            className="text-[11px] font-normal tabular-nums"
                                                                        >
                                                                            %{pct}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        })}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}
        </div>
    );
};
