export type ContentStatus = "idee" | "script-pret" | "tournage" | "montage" | "planifie" | "publie";

export interface ScheduledItem {
  id: number;
  hook: string;
  emoji: string;
  cat: string;
  status: ContentStatus;
  platform: "ig" | "tk" | "both";
  date: string;
  time?: string;
}

export interface UnscheduledItem {
  id: number;
  hook: string;
  emoji: string;
  cat: string;
  status: "idee" | "script-pret";
}

export const STATUS_LABELS: Record<ContentStatus, string> = {
  "idee": "Idée",
  "script-pret": "Script prêt",
  "tournage": "Tournage",
  "montage": "Montage",
  "planifie": "Planifié",
  "publie": "Publié",
};

export const STATUS_COLORS: Record<ContentStatus, string> = {
  "idee": "#8b5cf6",
  "script-pret": "#f59e0b",
  "tournage": "#3b82f6",
  "montage": "#f43f5e",
  "planifie": "#10b981",
  "publie": "#22c55e",
};

export const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  "BTS": { bg: "bg-amber-50", text: "text-amber-700" },
  "ASMR": { bg: "bg-violet-50", text: "text-violet-700" },
  "Tendance": { bg: "bg-rose-50", text: "text-rose-700" },
  "Story": { bg: "bg-blue-50", text: "text-blue-700" },
  "Recette": { bg: "bg-emerald-50", text: "text-emerald-700" },
};

export const SCHEDULED_ITEMS: ScheduledItem[] = [
  { id: 1, hook: "Tu as 3 secondes avant que ce latte art disparaisse", emoji: "☕", cat: "ASMR", status: "publie", platform: "ig", date: "2026-02-03", time: "10:00" },
  { id: 2, hook: "Comment on prépare nos brunchs à 5h du mat'", emoji: "🍳", cat: "BTS", status: "publie", platform: "ig", date: "2026-02-05", time: "08:00" },
  { id: 3, hook: "On a testé la recette TikTok de l'avocado toast", emoji: "🥑", cat: "Tendance", status: "publie", platform: "both", date: "2026-02-08", time: "12:00" },
  { id: 4, hook: "Le son de 1000 grains versés dans le moulin", emoji: "🎧", cat: "ASMR", status: "planifie", platform: "ig", date: "2026-02-12", time: "10:00" },
  { id: 5, hook: "Notre babka est le produit de la semaine", emoji: "🍰", cat: "Recette", status: "planifie", platform: "ig", date: "2026-02-14", time: "09:00" },
  { id: 6, hook: "Le cocktail offert de la Saint-Valentin", emoji: "🍸", cat: "Tendance", status: "montage", platform: "both", date: "2026-02-14", time: "18:00" },
  { id: 7, hook: "Ce que commande un barista quand il ne travaille PAS", emoji: "☕", cat: "Story", status: "tournage", platform: "ig", date: "2026-02-19" },
  { id: 8, hook: "Pourquoi votre café maison n'a pas le même goût", emoji: "☕", cat: "Story", status: "script-pret", platform: "ig", date: "2026-02-21", time: "10:00" },
  { id: 9, hook: "1 journée dans la vie d'un franchisé Mamatte", emoji: "📹", cat: "BTS", status: "idee", platform: "ig", date: "2026-02-24" },
  { id: 10, hook: "Le secret de notre cold brew infusé 24h", emoji: "🫘", cat: "Recette", status: "script-pret", platform: "both", date: "2026-02-26", time: "11:00" },
];

export const UNSCHEDULED_ITEMS: UnscheduledItem[] = [
  { id: 101, hook: "POV : un client commande un 'café normal'", emoji: "😂", cat: "Tendance", status: "script-pret" },
  { id: 102, hook: "Le bruit de notre machine à espresso à 6h", emoji: "🎧", cat: "ASMR", status: "idee" },
  { id: 103, hook: "3 choses que j'aurais voulu savoir avant d'ouvrir", emoji: "💡", cat: "Story", status: "script-pret" },
  { id: 104, hook: "Le brunch parfait en 60 secondes chrono", emoji: "🍳", cat: "Recette", status: "idee" },
];

export const DAYS_FR = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
export const MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
