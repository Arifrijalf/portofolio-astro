export interface Repo {
  name: string;
  slug: string;
  description: string;
  language: string;
  topics: string[];
  stars: number;
  forks: number;
  updatedAt: string;
  htmlUrl: string;
}

const TARGET_SLUGS = new Set([
  "oscillator-calc",
  "dashboard-cloudflare",
  "portofolio-astro",
  "blurrr",
  "inkubatorbayi",
  "keuangan-keluarga",
  "cerdascermat",
]);

const FALLBACK: Repo[] = [
  {
    name: "Oscillator Calc",
    slug: "oscillator-calc",
    description:
      "Web-based RC Oscillator Frequency Calculator (PWA) with oscilloscope graph.",
    language: "JavaScript",
    topics: ["pwa", "calculator", "javascript"],
    stars: 0,
    forks: 0,
    updatedAt: "2026-07-08T18:28:59Z",
    htmlUrl: "https://github.com/Arifrijalf/Oscillator-Calc",
  },
  {
    name: "Dashboard Cloudflare",
    slug: "dashboard-cloudflare",
    description:
      "Centralized dashboard deployed on Cloudflare for monitoring distributed services.",
    language: "TypeScript",
    topics: ["cloudflare", "dashboard", "typescript"],
    stars: 0,
    forks: 0,
    updatedAt: "2026-08-04T01:58:12Z",
    htmlUrl: "https://github.com/Arifrijalf/Dashboard-cloudflare",
  },
  {
    name: "Portofolio Astro",
    slug: "portofolio-astro",
    description: "PCB blueprint inspired portfolio with original 3D scenes.",
    language: "HTML",
    topics: ["astro", "threejs", "portfolio"],
    stars: 0,
    forks: 0,
    updatedAt: "2026-08-09T16:43:22Z",
    htmlUrl: "https://github.com/Arifrijalf/portofolio-astro",
  },
  {
    name: "Blurrr",
    slug: "blurrr",
    description:
      "Real-time hand gesture detection application using MediaPipe.",
    language: "Python",
    topics: ["mediapipe", "python", "javascript"],
    stars: 0,
    forks: 0,
    updatedAt: "2026-07-25T13:24:39Z",
    htmlUrl: "https://github.com/Arifrijalf/blurrr",
  },
  {
    name: "Inkubator Bayi",
    slug: "inkubatorbayi",
    description:
      "High-precision temperature regulation for neonatal care with ESP32 PID control.",
    language: "C++",
    topics: ["esp32", "pid", "embedded"],
    stars: 0,
    forks: 0,
    updatedAt: "2026-07-18T11:22:50Z",
    htmlUrl: "https://github.com/Arifrijalf/InkubatorBayi",
  },
  {
    name: "Keuangan Keluarga",
    slug: "keuangan-keluarga",
    description:
      "A smart PWA application for managing personal and family cash flow.",
    language: "JavaScript",
    topics: ["pwa", "firebase", "javascript"],
    stars: 0,
    forks: 0,
    updatedAt: "2026-07-03T10:57:57Z",
    htmlUrl: "https://github.com/Arifrijalf/keuangan-keluarga",
  },
  {
    name: "Cerdas Cermat",
    slug: "cerdascermat",
    description: "Interactive quiz application built with TypeScript.",
    language: "TypeScript",
    topics: ["typescript", "quiz", "game"],
    stars: 0,
    forks: 0,
    updatedAt: "2026-06-21T12:32:36Z",
    htmlUrl: "https://github.com/Arifrijalf/CerdasCermat",
  },
];

interface GitHubApiRepo {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  html_url: string;
}

function toSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function matchesTarget(name: string): boolean {
  const slug = toSlug(name);
  if (TARGET_SLUGS.has(slug)) return true;
  const lower = name.toLowerCase();
  return (
    lower.includes("oscillator") ||
    lower.includes("dashboard") ||
    lower.includes("portofolio") ||
    lower.includes("blurrr") ||
    lower.includes("inkubator") ||
    lower.includes("keuangan") ||
    lower.includes("cerdas") ||
    lower.includes("sensor")
  );
}

function mapApi(api: GitHubApiRepo): Repo {
  return {
    name: api.name.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    slug: toSlug(api.name),
    description: api.description || "No description provided.",
    language: api.language || "Unknown",
    topics: Array.isArray(api.topics) ? api.topics.slice(0, 4) : [],
    stars: api.stargazers_count,
    forks: api.forks_count,
    updatedAt: api.pushed_at,
    htmlUrl: api.html_url,
  };
}

export async function fetchRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/Arifrijalf/repos?sort=updated&per_page=100",
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const list = (await res.json()) as GitHubApiRepo[];
    const matched = list.filter((r) => matchesTarget(r.name));
    if (matched.length > 0) return matched.slice(0, 7).map(mapApi);
    return FALLBACK;
  } catch {
    return FALLBACK;
  }
}
