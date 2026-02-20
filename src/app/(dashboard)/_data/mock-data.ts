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
