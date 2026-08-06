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
  "iot-control-center",
  "baby-incubator-pid",
  "esp32-monitoring",
  "rfid-access-system",
  "smart-parking",
  "fire-detection",
  "portfolio-website",
]);

const FALLBACK: Repo[] = [
  {
    name: "IoT Control Center",
    slug: "iot-control-center",
    description: "Centralized IoT dashboard for monitoring and managing distributed device fleets.",
    language: "JavaScript",
    topics: ["iot", "mqtt", "dashboard"],
    stars: 12,
    forks: 3,
    updatedAt: "2025-12-01T00:00:00Z",
    htmlUrl: "https://github.com/Arifrijalf/iot-control-center",
  },
  {
    name: "Baby Incubator PID",
    slug: "baby-incubator-pid",
    description: "High-precision temperature regulation for neonatal care with ESP32 PID control.",
    language: "C++",
    topics: ["esp32", "pid", "embedded"],
    stars: 9,
    forks: 2,
    updatedAt: "2025-10-15T00:00:00Z",
    htmlUrl: "https://github.com/Arifrijalf/baby-incubator-pid",
  },
  {
    name: "ESP32 Monitoring",
    slug: "esp32-monitoring",
    description: "Real-time environmental monitoring using distributed ESP32 sensor nodes over MQTT.",
    language: "C",
    topics: ["esp32", "mqtt", "sensors"],
    stars: 7,
    forks: 1,
    updatedAt: "2025-09-02T00:00:00Z",
    htmlUrl: "https://github.com/Arifrijalf/esp32-monitoring",
  },
  {
    name: "RFID Access System",
    slug: "rfid-access-system",
    description: "RFID-based door access control with event logging and user management.",
    language: "C++",
    topics: ["rfid", "embedded", "security"],
    stars: 5,
    forks: 1,
    updatedAt: "2025-08-20T00:00:00Z",
    htmlUrl: "https://github.com/Arifrijalf/rfid-access-system",
  },
  {
    name: "Smart Parking",
    slug: "smart-parking",
    description: "IoT parking occupancy detection with live slot availability dashboards.",
    language: "Python",
    topics: ["iot", "sensors", "dashboard"],
    stars: 6,
    forks: 2,
    updatedAt: "2025-07-11T00:00:00Z",
    htmlUrl: "https://github.com/Arifrijalf/smart-parking",
  },
  {
    name: "Fire Detection",
    slug: "fire-detection",
    description: "Edge fire detection system combining sensor fusion with on-device inference.",
    language: "C",
    topics: ["embedded", "edge", "safety"],
    stars: 4,
    forks: 0,
    updatedAt: "2025-06-05T00:00:00Z",
    htmlUrl: "https://github.com/Arifrijalf/fire-detection",
  },
  {
    name: "Portfolio Website",
    slug: "portfolio-website",
    description: "PCB blueprint inspired portfolio with original 3D scenes.",
    language: "Astro",
    topics: ["astro", "threejs", "portfolio"],
    stars: 3,
    forks: 0,
    updatedAt: "2026-08-05T00:00:00Z",
    htmlUrl: "https://github.com/Arifrijalf/portfolio-website",
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
    lower.includes("iot") ||
    lower.includes("incubator") ||
    lower.includes("esp32") ||
    lower.includes("rfid") ||
    lower.includes("parking") ||
    lower.includes("fire") ||
    lower.includes("portfolio")
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
      { headers: { Accept: "application/vnd.github+json" } }
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
