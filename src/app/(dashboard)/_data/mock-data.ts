// ═══ DASHBOARD DATA ═══

export const DASHBOARD_STATS = [
  {
    label: "Idées cette semaine",
    value: "12",
    change: "↑ +4 vs. sem. dernière",
    changeColor: "text-green-500",
    sub: null,
  },
  {
    label: "Outliers détectés",
    value: "13",
    change: null,
    changeColor: null,
    sub: [
      { label: "7 IG", color: "text-[#E1306C]", bg: "bg-pink-50" },
      { label: "6 TK", color: "text-tiktok", bg: "bg-tiktok-bg" },
    ],
  },
  {
    label: "Concurrents suivis",
    value: "5",
    change: null,
    changeColor: null,
    sub: [
      { label: "3 IG", color: "text-[#E1306C]", bg: "bg-pink-50" },
      { label: "2 TK", color: "text-tiktok", bg: "bg-tiktok-bg" },
    ],
  },
  {
    label: "Scripts générés",
    value: "5",
    change: "2 modifiés cette sem.",
    changeColor: "text-muted-rb",
    sub: null,
  },
];

export const VIRAL_ALERTS = [
  {
    id: 1,
    platform: "ig" as const,
    platformIcon: "simple-icons:instagram",
    platformColor: "text-[#E1306C]",
    account: "@columbus_cafe_fr",
    views: "245K vues",
    hook: "« Personne ne parle de cette technique de latte art »",
  },
  {
    id: 2,
    platform: "tk" as const,
    platformIcon: "simple-icons:tiktok",
    platformColor: "text-tiktok",
    account: "@colombus.officiel",
    views: "1.2M vues",
    hook: "« POV : tu es barista et un client commande un \"café normal\" »",
  },
];

export const LATEST_IDEAS_PREVIEW = [
  {
    id: 1,
    emoji: "☕",
    hook: "« Tu as 3 secondes avant que ce latte art disparaisse »",
    cat: "🔊 ASMR",
    diff: "Facile",
    diffColor: "text-green-600 bg-green-50",
    platforms: ["ig", "tk"] as ("ig" | "tk")[],
  },
  {
    id: 2,
    emoji: "🧑‍🍳",
    hook: "« Le secret de notre cold brew infusé 24h »",
    cat: "🧑‍🍳 Recette",
    diff: "Moyen",
    diffColor: "text-amber-600 bg-amber-50",
    platforms: ["ig"] as ("ig" | "tk")[],
  },
  {
    id: 3,
    emoji: "😂",
    hook: "« POV : un client commande un \"café normal\" »",
    cat: "🎭 Humour",
    diff: "Facile",
    diffColor: "text-green-600 bg-green-50",
    platforms: ["tk"] as ("ig" | "tk")[],
  },
  {
    id: 4,
    emoji: "🎧",
    hook: "« 50 grains de café moulus au ralenti #ASMR »",
    cat: "🔊 ASMR",
    diff: "Facile",
    diffColor: "text-green-600 bg-green-50",
    platforms: ["ig", "tk"] as ("ig" | "tk")[],
  },
];

export const TIKTOK_TRENDS = [
  { rank: 1, hashtag: "#CoffeeTok", views: "2.4B vues" },
  { rank: 2, hashtag: "#BaristaLife", views: "890M vues" },
  { rank: 3, hashtag: "#ASMRcafe", views: "540M vues" },
  { rank: 4, hashtag: "#FoodTok", views: "12.1B vues" },
  { rank: 5, hashtag: "#SmallBusinessTikTok", views: "4.2B vues" },
];

// ═══ IDEAS DATA ═══

export type Difficulty = "easy" | "medium" | "hard";

export interface Idea {
  id: number;
  hook: string;
  concept: string;
  why: string;
  cats: string[];
  diff: Difficulty;
  saved: boolean;
  emoji: string;
}

export const IDEAS: Idea[] = [
  {
    id: 1,
    hook: "« Tu as 3 secondes avant que ce latte art disparaisse »",
    concept: "Filmez le barista versant le latte art en plongée. Gros plan. Laissez le dessin se former en temps réel.",
    why: "L'ASMR + vue aérienne sont en tendance. 2,8x plus de vues.",
    cats: ["🔊 ASMR", "🎨 Plating"],
    diff: "easy",
    saved: false,
    emoji: "☕",
  },
  {
    id: 2,
    hook: "« Comment on prépare nos brunchs à 5h du mat' »",
    concept: "Montrez les coulisses : pâte à croissant, mise en place, première machine café dans le noir.",
    why: "Le BTS cuisine explose. Les spectateurs adorent le processus.",
    cats: ["🍳 BTS"],
    diff: "easy",
    saved: true,
    emoji: "🍳",
  },
  {
    id: 3,
    hook: "« On a testé la recette TikTok de l'avocado toast »",
    concept: "Recréez une recette virale. Comparez avec votre version maison. Réaction de l'équipe.",
    why: "Le format test viral est éprouvé. +45% d'engagement.",
    cats: ["🔥 Tendance", "🧑‍🍳 Recette"],
    diff: "medium",
    saved: false,
    emoji: "🥑",
  },
  {
    id: 4,
    hook: "« Ce que commande un barista quand il ne travaille PAS »",
    concept: "Votre barista montre sa commande personnelle, ses personnalisations secrètes.",
    why: "Le contenu insider crée un sentiment d'exclusivité.",
    cats: ["📖 Story"],
    diff: "easy",
    saved: false,
    emoji: "☕",
  },
  {
    id: 5,
    hook: "« Le son de 1000 grains versés dans le moulin »",
    concept: "Séquence ASMR pure : grains, moulin, extraction, mousse. Zéro parole, son maximal.",
    why: "Reels ASMR café font 3,1x plus de vues.",
    cats: ["🔊 ASMR"],
    diff: "easy",
    saved: false,
    emoji: "🎧",
  },
  {
    id: 6,
    hook: "« Notre babka est le produit de la semaine 🥇 »",
    concept: "Dévoilez un produit star. Montrez texture, cuisson, premier croc. Invitez à voter.",
    why: "Format 'produit de la semaine' crée un rendez-vous récurrent.",
    cats: ["🍳 BTS", "🧑‍🍳 Recette"],
    diff: "medium",
    saved: false,
    emoji: "🍰",
  },
  {
    id: 7,
    hook: "« Pourquoi votre café maison n'a pas le même goût »",
    concept: "Éducatif : mouture, température eau, fraîcheur grains. Mini-masterclass en 30 sec.",
    why: "Contenu éducatif → expert. Bon taux de sauvegarde (+120%).",
    cats: ["📖 Story"],
    diff: "medium",
    saved: false,
    emoji: "☕",
  },
  {
    id: 8,
    hook: "« Le cocktail offert de la Saint-Valentin 💌 »",
    concept: "Préparation cocktail en slow-motion. Ambiance romantique. Annoncez l'offre.",
    why: "Contenu saisonnier viral 3-5 jours avant l'événement.",
    cats: ["🔥 Tendance"],
    diff: "easy",
    saved: false,
    emoji: "🍸",
  },
  {
    id: 9,
    hook: "« 1 journée dans la vie d'un franchisé Mamatte »",
    concept: "Suivez le patron de 5h à la fermeture. Hauts, bas, moments humains. Vlog court.",
    why: "Format 'day in the life' parmi les plus performants.",
    cats: ["📖 Story", "🍳 BTS"],
    diff: "hard",
    saved: false,
    emoji: "🏃",
  },
];

// ═══ COMPETITORS DATA ═══

export interface Competitor {
  id: number;
  handle: string;
  name: string;
  avatar: string;
  avatarGradient: string;
  platform: "ig" | "tk";
  followers: string;
  reels: string;
  reelsLabel: string;
  topViews: string;
  change: string;
  changeColor: string;
  changeBg: string;
}

export const COMPETITORS: Competitor[] = [
  {
    id: 1,
    handle: "@columbus_cafe_fr",
    name: "Columbus Café & Co",
    avatar: "C",
    avatarGradient: "from-purple-100 to-pink-50",
    platform: "ig",
    followers: "124K",
    reels: "89",
    reelsLabel: "Reels",
    topViews: "245K",
    change: "↑ +12% ce mois",
    changeColor: "text-green-600",
    changeBg: "bg-green-50",
  },
  {
    id: 2,
    handle: "@cafe_joyeux",
    name: "Café Joyeux",
    avatar: "J",
    avatarGradient: "from-yellow-100 to-amber-50",
    platform: "ig",
    followers: "89K",
    reels: "56",
    reelsLabel: "Reels",
    topViews: "89K",
    change: "↑ +8% ce mois",
    changeColor: "text-green-600",
    changeBg: "bg-green-50",
  },
  {
    id: 3,
    handle: "@coutume_cafe",
    name: "Coutume Café",
    avatar: "Co",
    avatarGradient: "from-stone-custom to-beige",
    platform: "ig",
    followers: "45K",
    reels: "34",
    reelsLabel: "Reels",
    topViews: "52K",
    change: "↓ -3% ce mois",
    changeColor: "text-red-500",
    changeBg: "bg-red-50",
  },
  {
    id: 4,
    handle: "@colombus.officiel",
    name: "Columbus Café TikTok",
    avatar: "C",
    avatarGradient: "from-pink-50 to-tiktok-bg",
    platform: "tk",
    followers: "210K",
    reels: "156",
    reelsLabel: "Vidéos",
    topViews: "1.2M",
    change: "↑ +34% ce mois",
    changeColor: "text-green-600",
    changeBg: "bg-green-50",
  },
  {
    id: 5,
    handle: "@coutume.paris",
    name: "Coutume Café TikTok",
    avatar: "Ct",
    avatarGradient: "from-pink-50 to-tiktok-bg",
    platform: "tk",
    followers: "67K",
    reels: "89",
    reelsLabel: "Vidéos",
    topViews: "890K",
    change: "↑ +21% ce mois",
    changeColor: "text-green-600",
    changeBg: "bg-green-50",
  },
];

// ═══ OUTLIERS DATA ═══

export interface Outlier {
  id: number;
  hook: string;
  account: string;
  views: string;
  likes: string;
  date: string;
  viral: boolean;
  emoji: string;
  platform: "ig" | "tk";
}

export const IG_OUTLIERS: Outlier[] = [
  { id: 1, hook: "« Personne ne parle de cette technique de latte art »", account: "columbus_cafe_fr", views: "245K", likes: "12K", date: "5 Fév.", viral: true, emoji: "☕", platform: "ig" },
  { id: 2, hook: "« 3 choses que j'aurais voulu savoir avant d'ouvrir mon café »", account: "cafe_joyeux", views: "89K", likes: "4.1K", date: "3 Fév.", viral: true, emoji: "💡", platform: "ig" },
  { id: 3, hook: "« Ce client a commandé LE truc le plus bizarre »", account: "columbus_cafe_fr", views: "67K", likes: "3.2K", date: "1 Fév.", viral: false, emoji: "😳", platform: "ig" },
  { id: 4, hook: "« Le bruit de notre machine à espresso à 6h du matin »", account: "coutume_cafe", views: "52K", likes: "2.8K", date: "30 Jan.", viral: false, emoji: "🎧", platform: "ig" },
  { id: 5, hook: "« J'ai fait goûter notre nouveau menu à des inconnus »", account: "cafe_joyeux", views: "41K", likes: "1.9K", date: "28 Jan.", viral: false, emoji: "🍞", platform: "ig" },
  { id: 6, hook: "« Comment je transforme 2€ de café en 45€ de CA »", account: "columbus_cafe_fr", views: "38K", likes: "2.1K", date: "25 Jan.", viral: false, emoji: "💰", platform: "ig" },
  { id: 7, hook: "« La vérité sur notre croissant à 2,50€ »", account: "coutume_cafe", views: "34K", likes: "1.6K", date: "22 Jan.", viral: false, emoji: "🥐", platform: "ig" },
];

export const TK_OUTLIERS: Outlier[] = [
  { id: 101, hook: "« POV : tu es barista et un client commande un 'café normal' »", account: "colombus.officiel", views: "1.2M", likes: "89K", date: "6 Fév.", viral: true, emoji: "😂", platform: "tk" },
  { id: 102, hook: "« Le son de 50 grains de café moulus au ralenti #ASMR »", account: "coutume.paris", views: "890K", likes: "67K", date: "4 Fév.", viral: true, emoji: "🎧", platform: "tk" },
  { id: 103, hook: "« Petit café ou GRAND café ? La réponse va vous surprendre »", account: "colombus.officiel", views: "340K", likes: "24K", date: "2 Fév.", viral: true, emoji: "☕", platform: "tk" },
  { id: 104, hook: "« Recette secrète : notre sauce hollandaise en 30 sec »", account: "coutume.paris", views: "156K", likes: "11K", date: "30 Jan.", viral: false, emoji: "🍳", platform: "tk" },
  { id: 105, hook: "« On a laissé un inconnu faire notre menu du jour »", account: "colombus.officiel", views: "128K", likes: "9.2K", date: "28 Jan.", viral: false, emoji: "🎲", platform: "tk" },
  { id: 106, hook: "« Montrez cette vidéo à quelqu'un qui n'aime pas le café »", account: "coutume.paris", views: "98K", likes: "7.1K", date: "25 Jan.", viral: false, emoji: "☕", platform: "tk" },
];

// ═══ REELS DATA ═══

export interface Reel {
  hook: string;
  cat: string;
  power: string[];
  views: string;
  likes: string;
  comments: string;
  date: string;
  color: string;
}

export const REELS: Reel[] = [
  { hook: "« Tu ne vas pas croire ce qu'on prépare à 5h du matin »", cat: "🍳 BTS", power: ["croire", "prépare"], views: "3 241", likes: "142", comments: "18", date: "12 Fév. 2026", color: "☕" },
  { hook: "« Le secret de notre cold brew infusé 24h »", cat: "🧑‍🍳 Recette", power: ["secret"], views: "2 890", likes: "98", comments: "12", date: "8 Fév. 2026", color: "🫘" },
  { hook: "« ASMR : le son du latte art versé dans la tasse »", cat: "🔊 ASMR", power: [], views: "2 456", likes: "203", comments: "31", date: "10 Fév. 2026", color: "🎧" },
  { hook: "« On a testé la recette TikTok de l'avocado toast »", cat: "🔥 Tendance", power: ["testé"], views: "2 102", likes: "89", comments: "45", date: "5 Fév. 2026", color: "🥑" },
  { hook: "« Pourquoi votre café maison n'a pas le même goût »", cat: "📖 Story", power: ["pourquoi"], views: "1 876", likes: "67", comments: "23", date: "3 Fév. 2026", color: "☕" },
  { hook: "« Notre babka est le produit de la semaine 🥇 »", cat: "🍳 BTS", power: [], views: "1 654", likes: "78", comments: "8", date: "1 Fév. 2026", color: "🍰" },
  { hook: "« Le cocktail offert de la Saint-Valentin 💌 »", cat: "🔥 Tendance", power: ["offert"], views: "1 432", likes: "112", comments: "67", date: "14 Fév. 2026", color: "🍸" },
  { hook: "« Ce que commande un barista quand il ne travaille PAS »", cat: "📖 Story", power: ["secret"], views: "1 298", likes: "55", comments: "14", date: "28 Jan. 2026", color: "☕" },
  { hook: "« 1000 grains de café versés dans le moulin ASMR »", cat: "🔊 ASMR", power: [], views: "1 189", likes: "92", comments: "5", date: "25 Jan. 2026", color: "🫘" },
  { hook: "« Le brunch parfait en 60 secondes chrono ⏱️ »", cat: "🧑‍🍳 Recette", power: ["parfait"], views: "987", likes: "43", comments: "9", date: "22 Jan. 2026", color: "🍳" },
];

// ═══ SCRIPTS DATA ═══

export interface Script {
  id: number;
  hook: string;
  cat: string;
  catLabel: string;
  diff: "easy" | "medium" | "hard";
  diffLabel: string;
  diffColor: string;
  words: number;
  duration: string;
  date: string;
  status: "edited" | "original";
}

export const SCRIPTS: Script[] = [
  { id: 1, hook: "« Tu as 3 secondes avant que ce latte art disparaisse »", cat: "🔊 ASMR", catLabel: "Food ASMR", diff: "easy", diffLabel: "Facile", diffColor: "green", words: 147, duration: "~60s", date: "17 Fév. 2026", status: "edited" },
  { id: 2, hook: "« Le secret de notre cold brew infusé 24h »", cat: "🧑‍🍳 Recette", catLabel: "Recette", diff: "medium", diffLabel: "Moyen", diffColor: "amber", words: 143, duration: "~55s", date: "14 Fév. 2026", status: "original" },
  { id: 3, hook: "« Comment on prépare nos brunchs à 5h du mat' »", cat: "🍳 BTS", catLabel: "BTS", diff: "easy", diffLabel: "Facile", diffColor: "green", words: 132, duration: "~50s", date: "12 Fév. 2026", status: "edited" },
  { id: 4, hook: "« On a testé la recette TikTok de l'avocado toast »", cat: "🔥 Tendance", catLabel: "Tendance", diff: "medium", diffLabel: "Moyen", diffColor: "amber", words: 158, duration: "~65s", date: "10 Fév. 2026", status: "original" },
  { id: 5, hook: "« Ce que commande un barista quand il ne travaille PAS »", cat: "📖 Story", catLabel: "Story", diff: "easy", diffLabel: "Facile", diffColor: "green", words: 121, duration: "~45s", date: "8 Fév. 2026", status: "original" },
];

// ═══ REPORTS DATA ═══

export interface Report {
  id: number;
  title: string;
  summary: string;
  isNew: boolean;
}

export const REPORTS: Report[] = [
  { id: 0, title: "Semaine du 17 Fév. 2026", summary: "3 sujets gagnants · 5 structures de hook · 12 power words", isNew: true },
  { id: 1, title: "Semaine du 10 Fév. 2026", summary: "4 sujets gagnants · 3 structures de hook · 10 power words", isNew: false },
  { id: 2, title: "Semaine du 3 Fév. 2026", summary: "2 sujets gagnants · 4 structures de hook · 8 power words", isNew: false },
  { id: 3, title: "Semaine du 27 Jan. 2026", summary: "3 sujets gagnants · 2 structures de hook · 9 power words", isNew: false },
];

export const REPORT_DETAIL = {
  topReels: [
    { rank: 1, account: "@columbus_cafe_fr", views: "245K vues", hook: "« Personne ne parle de cette technique de latte art »", analysis: "Curiosity gap + démonstration de compétence professionnelle" },
    { rank: 2, account: "@cafe_joyeux", views: "89K vues", hook: "« 3 choses que j'aurais voulu savoir avant d'ouvrir mon café »", analysis: "Format listicle + vulnérabilité personnelle" },
    { rank: 3, account: "@columbus_cafe_fr", views: "67K vues", hook: "« Ce client a commandé LE truc le plus bizarre »", analysis: "Curiosité + transgression sociale" },
  ],
  winningTopics: [
    { title: "Coulisses de la préparation matinale", count: "7 Reels", desc: "Le contenu brut de cuisine surperforme le contenu produit. Les spectateurs veulent l'authenticité du « vrai travail »." },
    { title: "Processus latte art en vidéo", count: "5 Reels", desc: "Les vidéos ASMR de latte art en plongée font 3,1x le taux de complétion moyen." },
    { title: "Réactions clients aux nouveaux produits", count: "4 Reels", desc: "Les tests de dégustation « dans la rue » génèrent +45% d'engagement. Le format réaction est universellement apprécié." },
  ],
  hookStructures: [
    { title: "Pression temporelle + révélation", example: "« Tu as X secondes avant que… »", multiplier: "×2,8 vues" },
    { title: "Question + curiosité", example: "« Et si je vous disais que… » / « Savez-vous pourquoi… »", multiplier: "×2,1 vues" },
    { title: "Listicle insider", example: "« 3 choses que… » / « X choses que personne ne… »", multiplier: "×1,9 vues" },
    { title: "Polémique douce + transparence", example: "« La vérité sur… » / « Pourquoi notre X coûte Y€ »", multiplier: "×1,7 vues" },
    { title: "Transformation / Avant-Après", example: "« De X à Y en Z secondes » / « Regardez ce que… »", multiplier: "×1,5 vues" },
  ],
  emotionalTriggers: [
    "😲 Curiosité",
    "⏰ Urgence",
    "😰 FOMO",
    "🤫 Exclusivité",
    "😍 Admiration",
    "🙌 Appartenance",
  ],
  powerWords: [
    { word: "secret", count: 12 },
    { word: "avant", count: 8 },
    { word: "personne", count: 7 },
    { word: "seulement", count: 6 },
    { word: "vérité", count: 5 },
    { word: "enfin", count: 4 },
    { word: "bizarre", count: 4 },
    { word: "croire", count: 3 },
    { word: "jamais", count: 3 },
    { word: "gratuit", count: 2 },
  ],
};

// ═══ CHART DATA ═══

export const WEEKLY_VIEWS = [
  { week: "6 Jan.", views: 4200 },
  { week: "13 Jan.", views: 5100 },
  { week: "20 Jan.", views: 4800 },
  { week: "27 Jan.", views: 6200 },
  { week: "3 Fév.", views: 7100 },
  { week: "10 Fév.", views: 6800 },
  { week: "17 Fév.", views: 8400 },
  { week: "24 Fév.", views: 9200 },
];

export const ENGAGEMENT_DATA = {
  likes: 1247,
  comments: 312,
  saves: 89,
  total: 1648,
};

export const POSTING_HEATMAP = [
  [0, 1, 0, 2, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 0],
  [0, 2, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 2, 1, 0],
];

export const CATEGORY_PERFORMANCE = [
  { cat: "🍳 BTS", views: 4895, color: "#f59e0b" },
  { cat: "🔊 ASMR", views: 3645, color: "#8b5cf6" },
  { cat: "🧑‍🍳 Recette", views: 3877, color: "#10b981" },
  { cat: "🔥 Tendance", views: 3534, color: "#f43f5e" },
  { cat: "📖 Story", views: 3174, color: "#3b82f6" },
];

export const DAILY_VIEWS = [
  { day: 1, views: 245 }, { day: 2, views: 312 }, { day: 3, views: 278 },
  { day: 4, views: 356 }, { day: 5, views: 289 }, { day: 6, views: 198 },
  { day: 7, views: 167 }, { day: 8, views: 334 }, { day: 9, views: 412 },
  { day: 10, views: 378 }, { day: 11, views: 298 }, { day: 12, views: 445 },
  { day: 13, views: 389 }, { day: 14, views: 467 }, { day: 15, views: 356 },
  { day: 16, views: 312 }, { day: 17, views: 278 }, { day: 18, views: 423 },
  { day: 19, views: 389 }, { day: 20, views: 445 }, { day: 21, views: 512 },
  { day: 22, views: 478 }, { day: 23, views: 534 }, { day: 24, views: 498 },
  { day: 25, views: 567 }, { day: 26, views: 523 }, { day: 27, views: 489 },
  { day: 28, views: 612 }, { day: 29, views: 578 }, { day: 30, views: 645 },
];

export const GROWTH_DATA = { current: 8400, previous: 5900, change: 42.4 };

// ═══ VIDEO ANALYSIS DATA ═══

export type VideoType = "scriptless" | "scripted";

export interface ScrapedVideo {
  id: number;
  hook: string;
  account: string;
  views: string;
  likes: string;
  date: string;
  duration: string;
  platform: "ig" | "tk";
  videoType: VideoType;
  badge: string;
  analyzed: boolean;
  thumbnailGradient: string;
  emoji: string;
}

export interface VideoAnalysis {
  videoId: number;
  sceneDescription: string;
  visualTechniques: { name: string; confidence: number }[];
  whyViral: string;
  keyElements: { colorPalette: string; lighting: string; composition: string; rhythm: string };
  recreationSteps: string[];
}

export const SCRAPED_VIDEOS: ScrapedVideo[] = [
  {
    id: 201,
    hook: "Latte art rosetta en plongée — pas un mot, juste le geste",
    account: "columbus_cafe_fr",
    views: "312K",
    likes: "18K",
    date: "8 Fév.",
    duration: "0:28",
    platform: "ig",
    videoType: "scriptless",
    badge: "Sans script 🎬",
    analyzed: true,
    thumbnailGradient: "from-amber-200 via-orange-100 to-stone-custom",
    emoji: "☕",
  },
  {
    id: 202,
    hook: "Service du brunch en time-lapse — 50 assiettes en 2 minutes",
    account: "cafe_joyeux",
    views: "189K",
    likes: "11K",
    date: "6 Fév.",
    duration: "0:34",
    platform: "ig",
    videoType: "scriptless",
    badge: "Visuel pur ✨",
    analyzed: true,
    thumbnailGradient: "from-yellow-100 via-amber-50 to-beige",
    emoji: "🍳",
  },
  {
    id: 203,
    hook: "ASMR : extraction espresso en gros plan, mousse parfaite",
    account: "coutume.paris",
    views: "1.4M",
    likes: "92K",
    date: "5 Fév.",
    duration: "0:19",
    platform: "tk",
    videoType: "scriptless",
    badge: "Sans script 🎬",
    analyzed: false,
    thumbnailGradient: "from-stone-300 via-amber-100 to-cream",
    emoji: "🎧",
  },
  {
    id: 204,
    hook: "Food plating satisfaisant — avocado toast assemblé en slow-motion",
    account: "colombus.officiel",
    views: "567K",
    likes: "34K",
    date: "4 Fév.",
    duration: "0:41",
    platform: "tk",
    videoType: "scriptless",
    badge: "Visuel pur ✨",
    analyzed: false,
    thumbnailGradient: "from-green-100 via-lime-50 to-amber-50",
    emoji: "🥑",
  },
  {
    id: 205,
    hook: "Coulée de chocolat sur un croissant chaud — vue macro",
    account: "columbus_cafe_fr",
    views: "245K",
    likes: "15K",
    date: "3 Fév.",
    duration: "0:22",
    platform: "ig",
    videoType: "scriptless",
    badge: "Sans script 🎬",
    analyzed: true,
    thumbnailGradient: "from-amber-300 via-yellow-200 to-orange-100",
    emoji: "🍫",
  },
  {
    id: 206,
    hook: "Séquence hypnotique : grains de café versés au ralenti dans un moulin en cuivre",
    account: "coutume.paris",
    views: "890K",
    likes: "56K",
    date: "2 Fév.",
    duration: "0:31",
    platform: "tk",
    videoType: "scriptless",
    badge: "Sans script 🎬",
    analyzed: false,
    thumbnailGradient: "from-amber-200 via-stone-custom to-beige",
    emoji: "🫘",
  },
  {
    id: 207,
    hook: "Le geste parfait du barista qui fait mousser le lait — boucle infinie",
    account: "cafe_joyeux",
    views: "156K",
    likes: "9.8K",
    date: "1 Fév.",
    duration: "0:15",
    platform: "ig",
    videoType: "scriptless",
    badge: "Visuel pur ✨",
    analyzed: false,
    thumbnailGradient: "from-stone-200 via-cream to-amber-50",
    emoji: "🥛",
  },
  {
    id: 208,
    hook: "Assemblage d'un plateau petit-déjeuner vue du dessus — chaque élément posé un par un",
    account: "colombus.officiel",
    views: "423K",
    likes: "28K",
    date: "30 Jan.",
    duration: "0:47",
    platform: "tk",
    videoType: "scriptless",
    badge: "Sans script 🎬",
    analyzed: false,
    thumbnailGradient: "from-orange-100 via-amber-100 to-yellow-50",
    emoji: "🍞",
  },
];

// ═══ OUTLIER ANALYSES ═══

export const OUTLIER_ANALYSES: Record<number, VideoAnalysis> = {
  1: {
    videoId: 1,
    sceneDescription:
      "Le barista exécute une technique avancée de latte art en vue plongée. La caméra reste fixe, parfaitement centrée sur la tasse blanche. Le geste est précis, révélant un motif complexe en quelques secondes. Aucune narration — seul le son du lait versé est audible, créant une ambiance ASMR immersive.",
    visualTechniques: [
      { name: "Plongée (vue aérienne)", confidence: 96 },
      { name: "Gros plan / Macro", confidence: 93 },
      { name: "ASMR (son naturel)", confidence: 89 },
      { name: "Plan fixe (stabilisé)", confidence: 85 },
      { name: "Éclairage naturel chaud", confidence: 81 },
    ],
    whyViral:
      "Le hook 'Personne ne parle de...' crée un curiosity gap puissant. La vue aérienne du latte art est hypnotique et pousse au re-visionnage. L'absence de parole élimine la barrière linguistique, maximisant la portée internationale. Le format court (< 30s) optimise le taux de complétion.",
    keyElements: {
      colorPalette: "Tons chauds : brun espresso, blanc crème du lait, beige naturel du comptoir. Palette minimaliste et organique.",
      lighting: "Lumière naturelle douce, directionnelle (fenêtre latérale). Reflets subtils sur la surface du lait. Pas d'éclairage artificiel visible.",
      composition: "Cadrage centré, tasse occupe 70% du frame. Arrière-plan flouté (bokeh). Bords du comptoir visibles pour ancrer la scène.",
      rhythm: "Un seul plan continu, rythme dicté par le geste du barista. Pas de coupe. Accélération naturelle en fin de versement.",
    },
    recreationSteps: [
      "Installez un trépied en position plongée, directement au-dessus du plan de travail.",
      "Utilisez la lumière naturelle d'une fenêtre latérale. Éteignez les néons.",
      "Préparez un espresso avec une crema épaisse dans une tasse blanche.",
      "Filmez en 1080p/60fps avec stabilisation activée.",
      "Laissez le barista exécuter le versement naturellement — ne pas ralentir.",
      "Gardez 2-3 secondes de la tasse immobile à la fin pour la satisfaction visuelle.",
      "Publiez sans musique. Le son naturel EST le contenu.",
    ],
  },
  101: {
    videoId: 101,
    sceneDescription:
      "Un barista derrière le comptoir reçoit la commande d'un 'café normal'. Le format POV montre sa réaction face caméra, puis une série de plans rapides montrant les multiples choix possibles (taille, type de lait, sirop, température). L'humour naît du décalage entre la simplicité apparente et la complexité réelle.",
    visualTechniques: [
      { name: "POV (point de vue)", confidence: 97 },
      { name: "Montage rapide / Jump cuts", confidence: 94 },
      { name: "Texte overlay", confidence: 91 },
      { name: "Réaction face caméra", confidence: 88 },
      { name: "Son tendance TikTok", confidence: 84 },
    ],
    whyViral:
      "Le format POV barista crée une identification immédiate avec les professionnels du café ET les clients. L'humour situationnel est universel et partageable. Le montage rapide maintient l'attention. Le format 'relatable content' génère des commentaires massifs ('tellement vrai !'). La musique tendance TikTok amplifie la découvrabilité.",
    keyElements: {
      colorPalette: "Environnement réel du café : tons chauds du comptoir, blanc du tablier, couleurs variées des syrops en arrière-plan.",
      lighting: "Éclairage mixte café (LED + naturel). Pas de setup particulier — authenticité brute.",
      composition: "Selfie/POV en format vertical. Cadrage dynamique, mouvements de caméra intentionnellement amateurs pour l'authenticité.",
      rhythm: "Montage rapide (cuts toutes les 1-2 secondes). Rythme calé sur la musique. Progression comique crescendo.",
    },
    recreationSteps: [
      "Filmez en selfie derrière le comptoir. L'authenticité > la qualité technique.",
      "Commencez par la réaction 'un café normal ?' en face caméra.",
      "Montrez rapidement 5-6 options (expresso, filtre, cold brew, etc.) avec des jump cuts.",
      "Ajoutez du texte overlay pour chaque option ('Quel lait ?', 'Quelle taille ?').",
      "Utilisez un son tendance TikTok en fond — vérifiez les sons populaires du moment.",
      "Terminez par un plan comique (montagne de choix ou regard perdu).",
      "Ajoutez les hashtags #barista #CoffeeTok #POV dans la description.",
    ],
  },
  102: {
    videoId: 102,
    sceneDescription:
      "Un plan macro ultra-serré filme 50 grains de café tombant lentement dans un moulin manuel en cuivre. Le slow-motion capture chaque grain individuellement. Le son est amplifié — on entend le claquement de chaque grain contre le métal. La vidéo se termine par le début de la mouture avec un son ASMR croustillant.",
    visualTechniques: [
      { name: "Plan macro / Ultra gros plan", confidence: 98 },
      { name: "Slow-motion (120fps+)", confidence: 95 },
      { name: "ASMR (son amplifié)", confidence: 94 },
      { name: "Bokeh d'arrière-plan", confidence: 87 },
      { name: "Éclairage latéral dramatique", confidence: 83 },
    ],
    whyViral:
      "L'ASMR café est l'un des contenus les plus addictifs sur TikTok. Le slow-motion transforme un geste banal en spectacle visuel. Le son amplifié crée une réponse sensorielle immédiate. La qualité macro donne une impression premium. Le format boucle parfaitement pour le re-visionnage infini.",
    keyElements: {
      colorPalette: "Brun profond des grains, cuivre doré du moulin, crème de l'arrière-plan. Palette monochrome luxueuse.",
      lighting: "Éclairage latéral unique, chaud (3200K). Ombres dramatiques. Reflets dorés sur le cuivre.",
      composition: "Ultra gros plan. Les grains occupent 90% du cadre. Profondeur de champ extrêmement faible.",
      rhythm: "Slow-motion ×4. Chaque grain est un micro-événement. Rythme méditatif et hypnotique.",
    },
    recreationSteps: [
      "Utilisez un moulin manuel en métal (le cuivre/laiton rend le mieux visuellement).",
      "Placez votre téléphone en mode macro, très proche (5-10cm du moulin).",
      "Filmez en slow-motion (120fps minimum, 240fps idéal).",
      "Utilisez une seule lampe latérale. L'ombre est essentielle pour le volume.",
      "Versez les grains lentement, un par un ou en petit flux.",
      "Capturez le son avec le micro du téléphone très proche — l'ASMR est crucial.",
      "En post-production : augmentez légèrement le volume du son, ajoutez de la chaleur aux couleurs.",
    ],
  },
};

export const VIDEO_ANALYSES: Record<number, VideoAnalysis> = {
  201: {
    videoId: 201,
    sceneDescription:
      "Un barista verse du lait dans une tasse d'espresso en vue plongée. La caméra est fixe, parfaitement centrée sur la tasse. Le geste est fluide et continu, formant une rosetta classique. Aucune parole, seul le son naturel du versement est audible. La vidéo se termine par un léger zoom arrière révélant le motif complet.",
    visualTechniques: [
      { name: "Plongée (vue aérienne)", confidence: 97 },
      { name: "Gros plan / Macro", confidence: 92 },
      { name: "Plan fixe (stabilisé)", confidence: 88 },
      { name: "ASMR (son naturel)", confidence: 85 },
      { name: "Éclairage naturel chaud", confidence: 78 },
    ],
    whyViral:
      "La combinaison vue aérienne + gros plan crée une immersion hypnotique. L'absence de parole élimine la barrière linguistique (portée internationale). Le son naturel du versement déclenche une réponse ASMR. Le geste du barista communique une expertise sans explication. La brièveté (28s) maximise le taux de complétion et encourage le re-visionnage en boucle.",
    keyElements: {
      colorPalette: "Tons chauds : brun espresso, blanc crème, beige naturel du bois. Pas de couleurs vives — palette minimaliste et organique.",
      lighting: "Lumière naturelle douce, légèrement directionnelle (fenêtre latérale). Pas de flash ni d'éclairage artificiel visible. Reflets doux sur la surface du lait.",
      composition: "Cadrage centré parfait. La tasse occupe 70% du frame. Arrière-plan flouté (bokeh naturel). Bords de la table visibles pour ancrer la scène.",
      rhythm: "Un seul plan continu sans coupe. Rythme organique dicté par le geste du barista. Accélération naturelle vers la fin du versement.",
    },
    recreationSteps: [
      "Installez votre téléphone sur un trépied en position plongée, directement au-dessus du plan de travail.",
      "Utilisez la lumière naturelle d'une fenêtre latérale. Éteignez les néons du plafond.",
      "Préparez un espresso bien contrasté (crema épaisse) dans une tasse blanche ou beige.",
      "Filmez en mode vidéo 1080p/60fps. Activez la stabilisation si disponible.",
      "Laissez votre barista réaliser le versement naturellement. Ne lui demandez pas de ralentir.",
      "Coupez avant et après le versement. Gardez 2-3 secondes de la tasse immobile à la fin.",
      "Publiez sans musique — le son naturel EST le contenu. Ajoutez des sous-titres si nécessaire.",
    ],
  },
  202: {
    videoId: 202,
    sceneDescription:
      "Un time-lapse filmé en plongée montre la mise en place d'un service brunch. Les mains des cuisiniers apparaissent et disparaissent, déposant assiettes, couverts, garnitures. Le comptoir se remplit progressivement. La caméra fixe capture l'accumulation satisfaisante d'éléments visuels.",
    visualTechniques: [
      { name: "Time-lapse", confidence: 96 },
      { name: "Plongée (vue aérienne)", confidence: 94 },
      { name: "Plan fixe", confidence: 91 },
      { name: "Montage accéléré", confidence: 87 },
      { name: "Composition symétrique", confidence: 72 },
    ],
    whyViral:
      "Le time-lapse transforme un processus ordinaire en spectacle visuel. L'accumulation progressive déclenche un sentiment de satisfaction. Le format BTS humanise la marque. La vue aérienne donne une perspective rarement accessible au client. La musique synchronisée crée un effet mémorable.",
    keyElements: {
      colorPalette: "Palette vive et naturelle : vert avocat, orange saumon, blanc crème, brun pain. Contraste fort entre les aliments et le plan de travail neutre.",
      lighting: "Éclairage mixte : LED de cuisine + lumière naturelle. Température chaude. Ombres douces donnant du volume aux plats.",
      composition: "Vue zénithale centrée sur le plan de travail. Symétrie dans le placement des assiettes. Mouvement des mains crée un flux dynamique.",
      rhythm: "Accélération ×8 du temps réel. Coupes régulières entre les phases de préparation. Rythme crescendo.",
    },
    recreationSteps: [
      "Fixez votre téléphone en position zénithale avec un trépied ou un bras articulé.",
      "Nettoyez parfaitement votre plan de travail — il sera visible tout au long de la vidéo.",
      "Utilisez le mode time-lapse natif ou filmez en temps réel pour accélérer en post-production.",
      "Demandez à votre équipe de travailler normalement — pas besoin de chorégraphier.",
      "Filmez tout le service de la première assiette à la dernière (30-60 min de rush).",
      "En post-production, accélérez ×8 à ×12. Ajoutez une musique entraînante.",
      "Ajoutez un compteur d'assiettes en overlay pour gamifier le visionnage.",
    ],
  },
  205: {
    videoId: 205,
    sceneDescription:
      "Gros plan macro sur un croissant chaud sortant du four. Une cuillère verse lentement du chocolat fondu sur la surface croustillante. Le chocolat coule le long des couches feuilletées. La vapeur monte doucement. Pas de parole — uniquement le son du craquement et du chocolat qui coule.",
    visualTechniques: [
      { name: "Plan macro / Ultra gros plan", confidence: 96 },
      { name: "Slow-motion", confidence: 93 },
      { name: "ASMR (son amplifié)", confidence: 91 },
      { name: "Bokeh d'arrière-plan", confidence: 85 },
      { name: "Éclairage latéral dramatique", confidence: 80 },
    ],
    whyViral:
      "Le food porn en macro active des réponses sensorielles puissantes. Le slow-motion crée un moment de suspense et de satisfaction. L'ASMR du craquement est profondément satisfaisant. La simplicité du concept le rend universellement compréhensible. Le format court incite au partage.",
    keyElements: {
      colorPalette: "Brun doré du croissant, brun foncé du chocolat, blanc crème de la vapeur. Palette monochrome chaleureuse évoquant le luxe accessible.",
      lighting: "Éclairage latéral unique, chaud (3200K). Ombres dramatiques sur les couches du croissant. Contraste volontairement fort.",
      composition: "Le croissant occupe 80% du cadre. Profondeur de champ très faible (bokeh prononcé). Point de mise au point sur la zone de coulée.",
      rhythm: "Slow-motion ×2 au moment de la coulée. Vitesse normale pour l'intro. Un seul geste, un seul plan.",
    },
    recreationSteps: [
      "Sortez un croissant du four et agissez immédiatement — la vapeur disparaît vite.",
      "Placez votre téléphone très proche (10-15cm). Activez le mode macro si disponible.",
      "Utilisez une seule source de lumière latérale. Éteignez tout le reste.",
      "Filmez en slow-motion (120fps ou 240fps). Le ralenti est essentiel.",
      "Versez le chocolat lentement avec une cuillère. Le geste doit être fluide et continu.",
      "Capturez le son séparément avec un micro externe si possible.",
      "En post-production, ajustez la chaleur des couleurs (+15% warmth). N'ajoutez PAS de musique.",
    ],
  },
};
