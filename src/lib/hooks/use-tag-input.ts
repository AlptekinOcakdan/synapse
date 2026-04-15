import { useState, KeyboardEvent } from "react";

export function useTagInput(initialTags: string[] = []) {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState("");

    const addTag = (e?: KeyboardEvent) => {
        if (e && e.key !== "Enter") return;
        e?.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags(prev => [...prev, trimmed]);
            setInputValue("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(prev => prev.filter(t => t !== tag));
    };

    const resetTags = (newTags: string[] = []) => {
        setTags(newTags);
        setInputValue("");
    };

    return {
        tags,
        setTags,
        inputValue,
        setInputValue,
        addTag,
        removeTag,
        resetTags,
    };
}
