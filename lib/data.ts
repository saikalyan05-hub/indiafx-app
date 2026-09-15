export type Genre =
  | "All"
  | "Romance"
  | "Thriller"
  | "Drama"
  | "Comedy"
  | "College Life"
  | "CEO"
  | "Fantasy"
  | "Family";

export type Episode = {
  number: number;
  title: string;
  duration: string;
  thumbnail: string;
  synopsis: string;
  isLocked?: boolean;
};

export type Drama = {
  id: string;
  rank: number;
  title: string;
  tagline: string;
  description: string;
  genre: Genre[];
  episodes: number;
  image: string;
  cover: string;
  featuredImage?: string;
  trendingImage?: string;
  accent: string;
  glow: string;
  volume: string;
  rating: string;
  releaseYear: string;
  director: string;
  cast: string[];
  progress?: number;
  lastEpisodeWatched?: number;
  episodeList?: Episode[];
};

const generateEpisodes = (dramaTitle: string, count: number, coverImg: string): Episode[] => {
  const titles = [
    "The Unforeseen Encounter",
    "Whispers in the Dark",
    "The Broken Contract",
    "Secrets in the Rain",
    "A Price to Pay",
    "The Mask Falls",
    "Midnight Confessions",
    "Crossroads of Fate",
    "The Second Glance",
    "Echoes of Yesterday",
    "Playing with Fire",
    "The Final Reveal",
  ];

  return Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    title: titles[i % titles.length] || `Episode ${i + 1}`,
    duration: "4:48",
    thumbnail: coverImg,
    synopsis: `Episode ${i + 1}: As tensions escalate, the truth between them becomes impossible to hide.`,
    isLocked: i > 2,
  }));
};

export const dramas: Drama[] = [
  {
    id: "a-second-chance",
    rank: 1,
    title: "A Second Chance",
    tagline: "Some endings lead to new beginnings.",
    description:
      "A chance reunion rewrites a love that was never supposed to survive the first goodbye. When Aarav returns to Mumbai after five silent years, he discovers Priya never threw away their promise.",
    genre: ["Romance", "Drama"],
    episodes: 80,
    image: "/assets/cover-a-second-chance.png",
    cover: "/assets/cover-a-second-chance.png",
    featuredImage: "/assets/featured-01-a-second-chance.png",
    trendingImage: "/assets/trending-01-a-second-chance.png",
    accent: "#e31c3d",
    glow: "rgba(227,28,61,0.28)",
    volume: "VOL. 01",
    rating: "4.9 ★ (1.2M)",
    releaseYear: "2026",
    director: "Vikramaditya Roy",
    cast: ["Aarav Mathur", "Priya Sen", "Rishi Kapoor"],
    progress: 42,
    lastEpisodeWatched: 4,
    episodeList: generateEpisodes("A Second Chance", 80, "/assets/cover-a-second-chance.png"),
  },
  {
    id: "his-revenge",
    rank: 2,
    title: "His Revenge",
    tagline: "He came back for everything they took.",
    description:
      "A fallen heir returns with a smile sharp enough to cut the empire that betrayed him. Stripped of his birthright a decade ago, Reyansh now controls the board from the shadows.",
    genre: ["Thriller", "CEO"],
    episodes: 80,
    image: "/assets/cover-his-revenge.png",
    cover: "/assets/cover-his-revenge.png",
    featuredImage: "/assets/featured-02-his-revenge.png",
    trendingImage: "/assets/trending-02-his-revenge.png",
    accent: "#9b1b30",
    glow: "rgba(155,27,48,0.32)",
    volume: "VOL. 02",
    rating: "4.8 ★ (890K)",
    releaseYear: "2026",
    director: "Karan Johar Verma",
    cast: ["Reyansh Singhania", "Tara Singhal", "Devraj Rathore"],
    progress: 15,
    lastEpisodeWatched: 2,
    episodeList: generateEpisodes("His Revenge", 80, "/assets/cover-his-revenge.png"),
  },
  {
    id: "my-college-crush",
    rank: 3,
    title: "My College Crush",
    tagline: "Four years. One secret. Infinite butterflies.",
    description:
      "Campus chaos, stolen glances, and the kind of crush that turns lecture halls into heart-racing love stories. Ananya thought her feelings would stay buried until Kabir became her project partner.",
    genre: ["College Life", "Romance", "Comedy"],
    episodes: 60,
    image: "/assets/cover-my-college-crush.png",
    cover: "/assets/cover-my-college-crush.png",
    featuredImage: "/assets/featured-03-my-college-crush.png",
    trendingImage: "/assets/trending-03-my-college-crush.png",
    accent: "#e85d75",
    glow: "rgba(232,93,117,0.3)",
    volume: "VOL. 03",
    rating: "4.9 ★ (2.1M)",
    releaseYear: "2026",
    director: "Zoya Akhtar Bannerjee",
    cast: ["Kabir Mehra", "Ananya Deshmukh", "Sameer Khan"],
    progress: 70,
    lastEpisodeWatched: 12,
    episodeList: generateEpisodes("My College Crush", 60, "/assets/cover-my-college-crush.png"),
  },
  {
    id: "the-ceos-deal",
    rank: 4,
    title: "The CEO's Deal",
    tagline: "Business first. Heart later. Maybe never.",
    description:
      "A contract marriage with a billionaire tycoon was supposed to be strictly business. Feelings were explicitly banned in clause 4 — but both are about to break the rules.",
    genre: ["CEO", "Romance"],
    episodes: 75,
    image: "/assets/cover-the-ceos-deal.png",
    cover: "/assets/cover-the-ceos-deal.png",
    featuredImage: "/assets/featured-04-the-ceos-deal.png",
    trendingImage: "/assets/trending-04-the-ceos-deal.png",
    accent: "#1f3a5f",
    glow: "rgba(31,58,95,0.28)",
    volume: "VOL. 04",
    rating: "4.7 ★ (650K)",
    releaseYear: "2026",
    director: "Siddharth Anand",
    cast: ["Vikram Oberoi", "Nisha Patel", "Aryan Grover"],
    progress: 30,
    lastEpisodeWatched: 3,
    episodeList: generateEpisodes("The CEO's Deal", 75, "/assets/cover-the-ceos-deal.png"),
  },
  {
    id: "stolen-hearts",
    rank: 5,
    title: "Stolen Hearts",
    tagline: "She stole more than his secrets.",
    description:
      "A master jewel thief infiltrates the city's most exclusive gala, only to find the target's bodyguard is the one man who knows her real identity.",
    genre: ["Romance", "Thriller"],
    episodes: 60,
    image: "/assets/cover-stolen-hearts.png",
    cover: "/assets/cover-stolen-hearts.png",
    featuredImage: "/assets/featured-05-stolen-hearts.png",
    trendingImage: "/assets/trending-05-stolen-hearts.png",
    accent: "#7a2e4a",
    glow: "rgba(122,46,74,0.3)",
    volume: "VOL. 05",
    rating: "4.8 ★ (720K)",
    releaseYear: "2026",
    director: "Sriram Raghavan",
    cast: ["Maya D'Souza", "Armaan Malik", "Inspector Roy"],
    progress: 55,
    lastEpisodeWatched: 6,
    episodeList: generateEpisodes("Stolen Hearts", 60, "/assets/cover-stolen-hearts.png"),
  },
  {
    id: "more-than-friends",
    rank: 6,
    title: "More Than Friends",
    tagline: "Different stories. Same crazy journey.",
    description:
      "Good friends, brighter days, and the laughter that turns everyday chaos into lifelong memories. Four best friends navigate college, careers, and the delicate line between friendship and love.",
    genre: ["College Life", "Comedy", "Romance"],
    episodes: 80,
    image: "/assets/cover-more-than-friends.png",
    cover: "/assets/cover-more-than-friends.png",
    featuredImage: "/assets/cover-more-than-friends.png",
    trendingImage: "/assets/cover-more-than-friends.png",
    accent: "#c45c26",
    glow: "rgba(196,92,38,0.28)",
    volume: "VOL. 06",
    rating: "4.8 ★ (820K)",
    releaseYear: "2026",
    director: "Imtiaz Ali Sharma",
    cast: ["Rohan Kapoor", "Sneha Roy", "Aditi Sharma", "Varun Dhawan"],
    progress: 20,
    lastEpisodeWatched: 1,
    episodeList: generateEpisodes("More Than Friends", 80, "/assets/cover-more-than-friends.png"),
  },
  {
    id: "the-silent-love",
    rank: 7,
    title: "The Silent Love",
    tagline: "Some love stories are told in glances.",
    description:
      "Two introverts crossing paths on the same train each rainy evening. Words never spoken, yet hearts racing in perfect rhythm.",
    genre: ["Drama", "Romance", "Family"],
    episodes: 45,
    image: "/assets/cover-the-silent-love.png",
    cover: "/assets/cover-the-silent-love.png",
    featuredImage: "/assets/cover-the-silent-love.png",
    trendingImage: "/assets/trending-07-the-silent-love.png",
    accent: "#4b3f72",
    glow: "rgba(75,63,114,0.28)",
    volume: "VOL. 07",
    rating: "4.9 ★ (1.5M)",
    releaseYear: "2026",
    director: "Shoojit Sircar",
    cast: ["Neil Bhattacharya", "Radhika Apte Verma", "Kavita Rao"],
    progress: 85,
    lastEpisodeWatched: 8,
    episodeList: generateEpisodes("The Silent Love", 45, "/assets/cover-the-silent-love.png"),
  },
  {
    id: "reborn",
    rank: 8,
    title: "Reborn",
    tagline: "This life, she rewrites the ending.",
    description:
      "Given a supernatural second life, she wakes up five years in the past before her family's downfall — and this time she holds all the cards.",
    genre: ["Fantasy", "Drama", "Thriller"],
    episodes: 70,
    image: "/assets/cover-reborn.png",
    cover: "/assets/cover-reborn.png",
    featuredImage: "/assets/cover-reborn.png",
    trendingImage: "/assets/trending-08-reborn.png",
    accent: "#d97706",
    glow: "rgba(217,119,6,0.3)",
    volume: "VOL. 08",
    rating: "4.9 ★ (1.8M)",
    releaseYear: "2026",
    director: "Anurag Kashyap Sen",
    cast: ["Ishita Sharma", "Advait Joshi", "Bhavna Joshi"],
    progress: 45,
    lastEpisodeWatched: 5,
    episodeList: generateEpisodes("Reborn", 70, "/assets/cover-reborn.png"),
  },
];

export const heroSlides = dramas.slice(0, 5);

export const genres: {
  id: Genre;
  label: string;
  icon: string;
}[] = [
  { id: "All", label: "All", icon: "grid" },
  { id: "Romance", label: "Romance", icon: "heart" },
  { id: "Thriller", label: "Thriller", icon: "mask" },
  { id: "Drama", label: "Drama", icon: "clapper" },
  { id: "Comedy", label: "Comedy", icon: "smile" },
  { id: "College Life", label: "College Life", icon: "grad" },
  { id: "CEO", label: "CEO", icon: "briefcase" },
  { id: "Fantasy", label: "Fantasy", icon: "spark" },
  { id: "Family", label: "Family", icon: "users" },
];

export type Mood = {
  id: string;
  title: string;
  personality: "heartbreak" | "comedy" | "thriller" | "heal" | "fantasy" | "gold";
  image: string;
  href: string;
};

export const moods: Mood[] = [
  {
    id: "feel-the-love",
    title: "Feel\nthe Love",
    personality: "heartbreak",
    image: "/assets/mood-01-love.png",
    href: "/genres?mood=romance",
  },
  {
    id: "laugh-out-loud",
    title: "Laugh\nOut Loud",
    personality: "comedy",
    image: "/assets/mood-02-laugh.png",
    href: "/genres?mood=comedy",
  },
  {
    id: "thrill-your-mind",
    title: "Thrill\nYour Mind",
    personality: "thriller",
    image: "/assets/mood-03-thrill.png",
    href: "/genres?mood=thriller",
  },
  {
    id: "heal-your-heart",
    title: "Heal\nYour Heart",
    personality: "heal",
    image: "/assets/mood-04-heal.png",
    href: "/genres?mood=drama",
  },
  {
    id: "escape-reality",
    title: "Escape\nReality",
    personality: "fantasy",
    image: "/assets/mood-05-escape.png",
    href: "/genres?mood=fantasy",
  },
  {
    id: "live-bigger",
    title: "Live\nBigger",
    personality: "gold",
    image: "/assets/mood-06-bigger.png",
    href: "/genres?mood=ceo",
  },
];

export const comments = [
  {
    id: "c1",
    user: "Aanya Sharma",
    avatar: "/assets/avatar.png",
    text: "THIS PLOT TWIST 🔥😭 I literally gasped during the boardroom scene!",
    likes: 1284,
    drama: "His Revenge",
  },
  {
    id: "c2",
    user: "Kabir Malhotra",
    avatar: "/assets/avatar.png",
    text: "I NEED EPISODE 2 RIGHT NOW! The tension in their eyes is unreal.",
    likes: 986,
    drama: "A Second Chance",
  },
  {
    id: "c3",
    user: "Meera Sen",
    avatar: "/assets/avatar.png",
    text: "WHY IS THIS SO ADDICTIVE 😭 Binge-watched 8 episodes during lunch break!",
    likes: 2140,
    drama: "The CEO's Deal",
  },
];

export const news = [
  {
    id: "n1",
    title: "A Second Chance crosses 10 million hearts in week one",
    category: "Spotlight",
    image: "/assets/cover-a-second-chance.png",
    excerpt: "The micro-drama that made India rewind endings — and believe in new beginnings.",
  },
  {
    id: "n2",
    title: "Inside the 5-minute episode that feels like a feature film",
    category: "Craft",
    image: "/assets/cover-his-revenge.png",
    excerpt: "How IndiaFX directors pack a whole monsoon of emotion into a single commute.",
  },
  {
    id: "n3",
    title: "Campus crush stories are back — and louder than ever",
    category: "Culture",
    image: "/assets/cover-my-college-crush.png",
    excerpt: "College Life is the genre of the season. Lockers, late texts, and lecture-hall longing.",
  },
];

export const products = [
  {
    id: "p1",
    title: "A Second Chance Collector's Poster",
    price: "₹799",
    image: "/assets/cover-a-second-chance.png",
  },
  {
    id: "p2",
    title: "IndiaFX Script Notebook",
    price: "₹499",
    image: "/assets/cover-his-revenge.png",
  },
  {
    id: "p3",
    title: "Villain Era Oversized Tee",
    price: "₹1,299",
    image: "/assets/cover-my-college-crush.png",
  },
  {
    id: "p4",
    title: "Golden Hour Tote Bag",
    price: "₹899",
    image: "/assets/cover-the-ceos-deal.png",
  },
];

export function getDrama(id: string) {
  return dramas.find((d) => d.id === id);
}

export function searchDramas(query: string, list: Drama[] = dramas) {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  const ceoAlias = q.includes("billionaire") || q.includes("ceo");

  return list.filter((d) => {
    if (ceoAlias && d.genre.includes("CEO")) return true;
    return (
      d.title.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q) ||
      d.director.toLowerCase().includes(q) ||
      d.genre.some((g) => g.toLowerCase().includes(q)) ||
      d.cast.some((c) => c.toLowerCase().includes(q))
    );
  });
}
