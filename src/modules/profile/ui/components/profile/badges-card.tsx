"use client";

import { useState } from "react";
import { Award, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getInitials, formatDate } from "@/lib/utils";

type BadgeItem = {
    _id: Id<"badges">;
    title: string;
    description: string;
    issuedAt: string;
    issuer: { name: string; title: string; avatar: string };
};

export const BadgesCard = ({ userId }: { userId: Id<"users"> }) => {
    const badges = useQuery(api.badges.getBadgesForUser, { userId });
    const [selected, setSelected] = useState<BadgeItem | null>(null);

    if (badges === undefined) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    if (badges.length === 0) return null;

    return (
        <>
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="w-5 h-5 text-primary" /> Rozetler
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-3">
                        {badges.map((badge) => (
                            <motion.button
                                key={badge._id}
                                type="button"
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelected(badge as BadgeItem)}
                                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-colors w-24 text-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 border border-primary/20">
                                    <Award className="w-5 h-5 text-primary" />
                                </span>
                                <span className="text-[11px] font-medium leading-tight line-clamp-2 text-foreground">
                                    {badge.title}
                                </span>
                            </motion.button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/20 shrink-0">
                                <Award className="w-6 h-6 text-primary" />
                            </span>
                            <DialogTitle className="text-xl leading-snug">{selected?.title}</DialogTitle>
                        </div>
                        <DialogDescription asChild>
                            <div className="space-y-4 pt-1">
                                <p className="text-sm text-foreground/80 leading-relaxed">
                                    {selected?.description}
                                </p>
                                <div className="flex items-center gap-3 pt-2 border-t border-border">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={selected?.issuer.avatar} />
                                        <AvatarFallback className="text-xs">
                                            {selected ? getInitials(selected.issuer.name) : ""}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">{selected?.issuer.name}</p>
                                        <p className="text-[11px] text-muted-foreground">{selected?.issuer.title}</p>
                                    </div>
                                    <span className="ml-auto text-[11px] text-muted-foreground">
                                        {selected ? formatDate(selected.issuedAt) : ""}
                                    </span>
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    );
};
