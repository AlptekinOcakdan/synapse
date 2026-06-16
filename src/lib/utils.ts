import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ReactNode } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface LayoutProps {
  children: ReactNode;
}

export function getInitials(name: string, fallback = ""): string {
  if (!name?.trim()) return fallback;
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getDeptLabel(
  value: string,
  departments: Array<{ value: string; label: string }> | undefined
): string {
  return departments?.find((d) => d.value === value)?.label ?? value;
}

/**
 * formatDate: Gelen tarih değerini (string | number | Date | null | undefined)
 * kullanıcıya okunabilir Türkçe biçiminde döndürür.
 * Örnek çıktı: "9 Ocak 2026"
 */
export function formatDate(value?: string | number | Date | null): string {
  if (!value && value !== 0) return "-";

  let date: Date;

  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "number") {
    date = new Date(value);
  } else {
    const strVal = String(value);
    // Bazı veritabanı formatları ISO veya timestamp string olabilir.
    const parsed = Number(strVal);
    if (!Number.isNaN(parsed) && strVal.trim() !== "") {
      // sayısal string epoch olabilir
      date = new Date(parsed);
    } else {
      date = new Date(strVal);
    }
  }

  if (Number.isNaN(date.getTime())) return String(value) || "-";

  try {
    return new Intl.DateTimeFormat("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return date.toDateString();
  }
}
