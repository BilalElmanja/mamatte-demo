// ═══ LANDING PAGE CONTENT CONSTANTS ═══

export const NAV_LINKS = [
  { label: "Fonctionnalites", href: "#features" },
  { label: "Comment ca marche", href: "#how" },
  { label: "FAQ", href: "#faq" },
] as const;

export const MARQUEE_BRANDS = [
  "MAMATTE",
  "COLUMBUS CAFE",
  "CAFE JOYEUX",
  "COUTUME",
  "BELLEVILLE BRULERIE",
  "LOMI PARIS",
  "CAFE OBERKAMPF",
  "TERRES DE CAFE",
] as const;

export const STATS = [
  { value: 2.8, suffix: "\u00d7", label: "plus de vues en moyenne" },
  { value: 12, suffix: "", label: "idees generees / semaine" },
  { value: 5, suffix: "", label: "pour tout configurer", unit: "min" },
  { value: 0, suffix: "\u20ac", label: "d\u2019abonnement \u00b7 vos API keys" },
] as const;

export const PROBLEM_CARDS = [
  {
    emoji: "\ud83d\ude29",
    title: "Pas d\u2019inspiration",
    description:
      "Vous ne savez plus quoi poster. Vos Reels stagnent. L\u2019engagement chute.",
  },
  {
    emoji: "\u23f0",
    title: "Pas le temps",
    description:
      "Entre le service et la gestion, Instagram passe toujours en dernier.",
  },
  {
    emoji: "\ud83c\udfaf",
    title: "Pas de strategie",
    description:
      "Vous postez au feeling sans data sur ce qui marche dans votre niche.",
  },
] as const;

export const FEATURES = [
  {
    icon: "solar:users-group-rounded-linear",
    title: "Veille concurrentielle",
    description:
      "Suivez jusqu\u2019\u00e0 10 concurrents sur Instagram et TikTok. Reels, videos, vues, hooks et transcripts analyses chaque semaine automatiquement.",
    image:
      "https://images.unsplash.com/photo-1504627298321-9127024c0c5f?w=600&h=300&fit=crop",
  },
  {
    icon: "solar:fire-linear",
    title: "Alertes virales",
    description:
      "Un concurrent explose ? Alerte immediatement avec l\u2019analyse de pourquoi ca marche et comment vous inspirer.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop",
  },
  {
    icon: "solar:lightbulb-linear",
    title: "Idees pretes a filmer",
    description:
      "12 idees/semaine avec hook, concept, categorie et niveau de difficulte. Basees sur ce qui marche dans votre niche.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=300&fit=crop",
  },
  {
    icon: "solar:magic-stick-3-linear",
    title: "Remix & Generation IA",
    description:
      "Un clic sur un Reel ou TikTok concurrent \u2192 votre version unique avec hooks, script structure et caption. Cross-platform.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=300&fit=crop",
  },
  {
    icon: "solar:document-text-linear",
    title: "Scripts structures",
    description:
      "Accroche \u2192 Contexte \u2192 Valeur \u2192 CTA. Prets a lire devant la camera avec caption, hashtags IG et TikTok optimises.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=300&fit=crop",
  },
  {
    icon: "solar:chart-2-linear",
    title: "Rapports hebdomadaires",
    description:
      "Sujets gagnants, hooks performants, power words, emotions qui convertissent. Votre cheat sheet strategique.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop",
  },
] as const;

export const STEPS = [
  {
    number: "01",
    icon: "solar:settings-linear",
    title: "Configurez vos cles",
    description:
      "Ajoutez vos cles API (OpenAI, Apify, RapidAPI). Connectez Instagram et TikTok. En route en 5 minutes.",
    tags: ["OpenAI", "Apify", "RapidAPI", "TikTok API"],
    iconBg: "bg-ink",
  },
  {
    number: "02",
    icon: "solar:users-group-rounded-linear",
    title: "Ajoutez vos concurrents",
    description:
      "Jusqu\u2019\u00e0 10 comptes Instagram et TikTok. ReelBoost scrape leurs videos, transcrit l\u2019audio, et analyse hooks et performance.",
    tags: [],
    iconBg: "bg-ink",
  },
  {
    number: "03",
    icon: "solar:stars-minimalistic-bold",
    title: "Recevez & Creez",
    description:
      "Chaque dimanche : idees cross-platform, scripts, outliers IG & TikTok, rapports. Remixez, adaptez, filmez, postez.",
    tags: [],
    iconBg: "bg-gold",
  },
] as const;

export const BEFORE_ITEMS = [
  { views: "214 vues", widthMain: "w-3/4", widthSub: "w-1/2", opacity: "opacity-50" },
  { views: "187 vues", widthMain: "w-2/3", widthSub: "w-2/5", opacity: "opacity-40" },
  { views: "156 vues", widthMain: "w-4/5", widthSub: "w-1/3", opacity: "opacity-30" },
] as const;

export const AFTER_ITEMS = [
  {
    emoji: "\u2615",
    title: "\u00ab Tu as 3 secondes avant que... \u00bb",
    tag: "ASMR",
    platforms: ["IG", "TK"],
    views: "3.2K vues",
  },
  {
    emoji: "\ud83c\udf73",
    title: "\u00ab Comment on prepare nos brunchs \u00bb",
    tag: "BTS",
    platforms: ["IG"],
    views: "2.8K vues",
  },
  {
    emoji: "\ud83d\ude02",
    title: "\u00ab POV: un client commande un \u201ccafe normal\u201d \u00bb",
    tag: "Humour",
    platforms: ["TK"],
    views: "12K vues",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Youssef Amrani",
    handle: "@mamatte.brunch.cafe",
    text: "\u00ab On est passe de 300 a 3 000 vues par Reel en 3 semaines. Les hooks suggeres sont incroyablement efficaces. La fonctionnalite S\u2019inspirer a change notre maniere de creer du contenu. \u00bb",
    stars: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Sophie Clement",
    handle: "@cafe.sophie.paris",
    text: "\u00ab La fonctionnalite Remix est un game-changer. Je vois un TikTok viral, je clique, et j\u2019ai mon propre script en 30 secondes \u2014 pour Instagram et TikTok a la fois. \u00bb",
    stars: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Marc Lefevre",
    handle: "@brew.brothers.lyon",
    text: "\u00ab Les rapports m\u2019ont revele que le BTS cuisine faisait 3\u00d7 plus de vues que mes posts produits. La data ne ment pas. Mon engagement a double en un mois. \u00bb",
    stars: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Pourquoi dois-je fournir mes propres cles API ?",
    answer:
      "Pour garder le controle total. Pas de middleman, pas de markup, pas de donnees partagees. Vos cles, votre data, votre vie privee. Et le cout total ? ~3\u20ac/mois.",
  },
  {
    question: "Comment fonctionne la veille concurrentielle ?",
    answer:
      "Chaque dimanche, ReelBoost scrape les Reels et TikToks de vos concurrents via Apify, transcrit l\u2019audio avec Whisper, et analyse les hooks, power words et patterns de performance avec GPT-4o. Les deux plateformes dans un seul dashboard.",
  },
  {
    question: "C\u2019est legal de scraper Instagram et TikTok ?",
    answer:
      "ReelBoost analyse uniquement des donnees publiquement accessibles. C\u2019est de la veille concurrentielle automatisee \u2014 exactement comme consulter manuellement le profil d\u2019un concurrent.",
  },
  {
    question: "Ca marche pour d\u2019autres niches que le cafe ?",
    answer:
      "Oui ! Cafes, restaurants, boulangeries, bars, food trucks \u2014 tout business food Instagram-first. L\u2019IA s\u2019adapte a votre niche et a votre ton de marque.",
  },
  {
    question: "Combien de temps pour voir des resultats ?",
    answer:
      "La majorite voit une difference des la 2e semaine. En moyenne : \u00d72,8 de vues en 4 semaines en suivant les recommandations de la plateforme.",
  },
] as const;

export const FOOTER_LINKS = {
  produit: {
    title: "Produit",
    links: [
      { label: "Fonctionnalites", href: "#features" },
      { label: "Comment ca marche", href: "#how" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  application: {
    title: "Application",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Idees", href: "/ideas" },
      { label: "Outliers", href: "/outliers" },
      { label: "Scripts", href: "/scripts" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Confidentialite", href: "#" },
      { label: "CGU", href: "#" },
      { label: "Mentions legales", href: "#" },
    ],
  },
} as const;

export const SOCIAL_LINKS = [
  { icon: "simple-icons:instagram", href: "#", label: "Instagram" },
  { icon: "simple-icons:x", href: "#", label: "X" },
  { icon: "simple-icons:github", href: "#", label: "GitHub" },
] as const;
