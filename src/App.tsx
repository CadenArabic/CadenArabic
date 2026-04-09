import { useCallback, useEffect, useRef, useState } from "react";

import { CometCard } from "./components/ui/comet-card";

/* ─── Data ─── */

type ServiceEntry = {
  title: string;
  description: string;
  icon: "gameplay" | "ui" | "optimize";
};

const skillPills = [
  "Luau Scripting",
  "Gameplay Systems",
  "UI Logic",
  "Data Stores",
  "Leaderboards",
  "Optimization",
];

const services: ServiceEntry[] = [
  {
    title: "Gameplay Systems",
    description:
      "Custom mechanics, round systems, progression loops, and clean scripting foundations built for smooth player experiences.",
    icon: "gameplay",
  },
  {
    title: "UI + Interaction",
    description:
      "Responsive menus, shop flows, buttons, prompts, and in-game interactions connected cleanly to backend logic.",
    icon: "ui",
  },
  {
    title: "Optimization + Structure",
    description:
      "Organized code, reusable modules, and scalable systems that make future updates easier as your game grows.",
    icon: "optimize",
  },
];

type GameEntry = {
  title: string;
  url: string;
  placeId: string;
  universeId: string | null;
};

const robloxGames: GameEntry[] = [
  {
    title: "Escape Train for Brainrots",
    url: "https://www.roblox.com/games/93014298159631/Escape-Train-for-Brainrots",
    placeId: "93014298159631",
    universeId: "9825427575",
  },
  {
    title: "Escape Falling Stairs for Brainrot",
    url: "https://www.roblox.com/games/116990588746086/Escape-Falling-Stairs-for-Brainrot",
    placeId: "116990588746086",
    universeId: "9715259353",
  },
  {
    title: "Four in a Row",
    url: "https://www.roblox.com/games/118638953131946/Four-in-a-Row",
    placeId: "118638953131946",
    universeId: "9488122827",
  },
  {
    title: "Bomb Card",
    url: "https://www.roblox.com/games/80288638708154/Bomb-Card",
    placeId: "80288638708154",
    universeId: "9539819854",
  },
  {
    title: "Obby to Brainrots",
    url: "https://www.roblox.com/games/74344557530102/Obby-to-Brainrots",
    placeId: "74344557530102",
    universeId: "9857780163",
  },
  {
    title: "Steal a Celebrity",
    url: "https://www.roblox.com/games/96771164438323/Steal-a-Celebrity",
    placeId: "96771164438323",
    universeId: "8048361149",
  },
  {
    title: "Feed Your Pets",
    url: "https://www.roblox.com/games/140049315593804/Feed-Your-Pets",
    placeId: "140049315593804",
    universeId: "8770927660",
  },
  {
    title: "FREE ADMIN Samurai Troll Tower",
    url: "https://www.roblox.com/games/115768905804211/FREE-ADMIN-Samurai-Troll-Tower",
    placeId: "115768905804211",
    universeId: "8158669578",
  },
  {
    title: "Fling a Brainrot",
    url: "https://www.roblox.com/games/93108774146455/Fling-a-Brainrot",
    placeId: "93108774146455",
    universeId: "8471471873",
  },
  {
    title: "Dangerous RV Driving",
    url: "https://www.roblox.com/games/78758085598611/Dangerous-RV-Driving",
    placeId: "78758085598611",
    universeId: "9160234761",
  },
];

const beamLines = [
  { left: "4%", top: "20%", width: "32rem", duration: "16s", delay: "-4s" },
  { left: "18%", top: "76%", width: "28rem", duration: "13s", delay: "-7s" },
  { left: "52%", top: "16%", width: "26rem", duration: "15s", delay: "-9s" },
  { left: "64%", top: "62%", width: "22rem", duration: "12s", delay: "-5s" },
];

const particles = [
  { size: 6, left: "9%", top: "24%", duration: "11s", delay: "-2s" },
  { size: 3, left: "12%", top: "68%", duration: "9s", delay: "-5s" },
  { size: 4, left: "20%", top: "44%", duration: "10s", delay: "-3s" },
  { size: 5, left: "31%", top: "18%", duration: "12s", delay: "-6s" },
  { size: 3, left: "38%", top: "78%", duration: "8s", delay: "-1s" },
  { size: 5, left: "49%", top: "32%", duration: "10s", delay: "-4s" },
  { size: 4, left: "56%", top: "58%", duration: "9s", delay: "-7s" },
  { size: 6, left: "66%", top: "22%", duration: "11s", delay: "-8s" },
  { size: 4, left: "72%", top: "72%", duration: "10s", delay: "-3s" },
  { size: 5, left: "84%", top: "36%", duration: "12s", delay: "-9s" },
  { size: 3, left: "90%", top: "18%", duration: "8s", delay: "-4s" },
  { size: 4, left: "94%", top: "64%", duration: "9s", delay: "-2s" },
  { size: 6, left: "60%", top: "8%", duration: "11s", delay: "-6s" },
  { size: 3, left: "42%", top: "8%", duration: "13s", delay: "-10s" },
];

const navSections = ["about", "stats", "services", "games", "contact"] as const;

const numberFormatter = new Intl.NumberFormat("en-US");

/* ─── Roblox API Helpers ─── */

type RobloxApiItem = Record<string, unknown>;

type TrackedGame = GameEntry & {
  universeId: string | null;
  playing: number | null;
  visits: number | null;
  thumbnailUrl: string | null;
};

type LiveStatsState = {
  totalVisits: number;
  activePlayers: number;
  trackedGames: number;
  updatedAt: number | null;
  status: "loading" | "live" | "error";
  games: TrackedGame[];
};

const makeInitialGames = (): TrackedGame[] =>
  robloxGames.map((game) => ({
    ...game,
    universeId: game.universeId,
    playing: null,
    visits: null,
    thumbnailUrl: null,
  }));

const readApiArray = (payload: unknown): RobloxApiItem[] => {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is RobloxApiItem => typeof item === "object" && item !== null);
  }

  if (payload && typeof payload === "object") {
    const objectPayload = payload as { data?: unknown; gameDetails?: unknown };
    const candidate = objectPayload.data ?? objectPayload.gameDetails;

    if (Array.isArray(candidate)) {
      return candidate.filter((item): item is RobloxApiItem => typeof item === "object" && item !== null);
    }
  }

  return [];
};

const readInteger = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.floor(parsed));
    }
  }

  return null;
};

const readText = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
};

const readId = (value: unknown): string | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return null;
};

const formatMetric = (value: number | null, loadingText = "Loading...") => {
  if (value === null) {
    return loadingText;
  }

  return numberFormatter.format(value);
};

type FetchRequest = {
  url: string;
  init?: RequestInit;
};

const expandRequestUrls = (url: string, init?: RequestInit) => {
  if (init?.method && init.method.toUpperCase() !== "GET") {
    return [url];
  }

  return [
    url,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  ];
};

const fetchJsonWithFallback = async (requests: Array<string | FetchRequest>) => {
  let lastError: Error | null = null;
  const attempted = new Set<string>();

  for (const requestEntry of requests) {
    const request = typeof requestEntry === "string" ? { url: requestEntry } : requestEntry;

    for (const candidateUrl of expandRequestUrls(request.url, request.init)) {
      const requestKey = `${candidateUrl}::${request.init?.method ?? "GET"}::${typeof request.init?.body === "string" ? request.init.body : ""}`;

      if (attempted.has(requestKey)) {
        continue;
      }

      attempted.add(requestKey);

      const controller = new AbortController();
      const timeoutId = globalThis.setTimeout(() => controller.abort(), 9000);

      try {
        const response = await fetch(candidateUrl, {
          ...request.init,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return (await response.json()) as unknown;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Failed to fetch Roblox data");
      } finally {
        globalThis.clearTimeout(timeoutId);
      }
    }
  }

  throw lastError ?? new Error("Failed to fetch Roblox data");
};

const readUniverseIdFromPayload = (payload: unknown, placeId?: string) => {
  if (payload && typeof payload === "object") {
    const objectPayload = payload as Record<string, unknown>;
    const directUniverseId = readId(objectPayload.universeId) ?? readId(objectPayload.UniverseId);

    if (directUniverseId) {
      return directUniverseId;
    }
  }

  const entries = readApiArray(payload);
  const matchedEntry = placeId
    ? entries.find((entry) => readId(entry.placeId) === placeId || readId(entry.placeID) === placeId)
    : entries[0];

  if (!matchedEntry) {
    return null;
  }

  const nestedUniverse = matchedEntry.universe;
  const nestedUniverseId = nestedUniverse && typeof nestedUniverse === "object"
    ? readId((nestedUniverse as Record<string, unknown>).id)
    : null;

  return readId(matchedEntry.universeId) ?? readId(matchedEntry.UniverseId) ?? nestedUniverseId;
};

const fetchUniverseIdForPlace = async (placeId: string) => {
  const legacyUrls = [
    `https://api.roproxy.com/universes/get-universe-containing-place?placeid=${placeId}`,
    `https://api.roblox.com/universes/get-universe-containing-place?placeid=${placeId}`,
  ];

  try {
    const legacyPayload = await fetchJsonWithFallback(legacyUrls);
    const legacyUniverseId = readUniverseIdFromPayload(legacyPayload, placeId);

    if (legacyUniverseId) {
      return legacyUniverseId;
    }
  } catch {
    // Try the newer place details endpoints next.
  }

  const placeDetailUrls = [
    `https://games.roproxy.com/v1/games/multiget-place-details?placeIds=${placeId}`,
    `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`,
  ];

  const placeDetailsPayload = await fetchJsonWithFallback(placeDetailUrls);
  const placeDetailsUniverseId = readUniverseIdFromPayload(placeDetailsPayload, placeId);

  if (placeDetailsUniverseId) {
    return placeDetailsUniverseId;
  }

  throw new Error(`Unable to resolve universe for place ${placeId}`);
};

const fetchLiveGameEntries = async (universeIds: string[]) => {
  const joinedUniverseIds = universeIds.join(",");
  const liveUrls = [
    `https://games.roproxy.com/v1/games?universeIds=${joinedUniverseIds}`,
    `https://games.roblox.com/v1/games?universeIds=${joinedUniverseIds}`,
  ];

  try {
    const payload = await fetchJsonWithFallback(liveUrls);
    const entries = readApiArray(payload);

    if (entries.length > 0) {
      return entries;
    }
  } catch {
    // Fall back to single-universe requests below.
  }

  const settled = await Promise.all(
    universeIds.map(async (universeId) => {
      try {
        const payload = await fetchJsonWithFallback([
          `https://games.roproxy.com/v1/games?universeIds=${universeId}`,
          `https://games.roblox.com/v1/games?universeIds=${universeId}`,
        ]);

        return readApiArray(payload)[0] ?? null;
      } catch {
        return null;
      }
    }),
  );

  return settled.filter((entry): entry is RobloxApiItem => entry !== null);
};

const fetchThumbnailMap = async (universeIds: string[]) => {
  const thumbnailPayload = await fetchJsonWithFallback([
    `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeIds.join(",")}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
    `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds.join(",")}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
  ]);

  const thumbnailEntries = readApiArray(thumbnailPayload);
  const thumbnailByUniverse = new Map<string, string>();

  thumbnailEntries.forEach((item) => {
    const targetId = readId(item.targetId);
    const imageUrl = readText(item.imageUrl);

    if (targetId && imageUrl) {
      thumbnailByUniverse.set(targetId, imageUrl);
    }
  });

  return thumbnailByUniverse;
};

/* ─── Hooks ─── */

function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);
}

function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
          );
          setActiveSection(topMost.target.id);
        }
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" },
    );

    navSections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(window.scrollY / pageHeight, 0), 1);
      setProgress(scrollProgress);
      setShowTopBtn(window.scrollY > 400);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { progress, showTopBtn };
}

function useTypewriter(text: string, speed = 70, startDelay = 600) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    let timeoutId: number;

    const tick = () => {
      if (index <= text.length) {
        setDisplayed(text.slice(0, index));
        index++;
        timeoutId = window.setTimeout(tick, speed);
      } else {
        setDone(true);
      }
    };

    timeoutId = window.setTimeout(tick, startDelay);

    return () => window.clearTimeout(timeoutId);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* ─── Icons ─── */

function ServiceIcon({ type }: { type: ServiceEntry["icon"] }) {
  if (type === "gameplay") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 10h10a3 3 0 0 1 3 3v1a4 4 0 0 1-4 4l-2-2H10l-2 2a4 4 0 0 1-4-4v-1a3 3 0 0 1 3-3Z" />
        <path d="M8.5 13.5h3" />
        <path d="M10 12v3" />
        <path d="M15.5 13.5h.01" />
        <path d="M18 13.5h.01" />
      </svg>
    );
  }

  if (type === "ui") {
    return (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="5" width="17" height="11" rx="2.5" />
        <path d="M8 20h8" />
        <path d="M12 16v4" />
        <path d="M7 9h5" />
        <path d="M7 12h8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5 12 4l8 3.5-8 3.5-8-3.5Z" />
      <path d="M4 12.5 12 16l8-3.5" />
      <path d="M4 17 12 20l8-3" />
    </svg>
  );
}

function LinkArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

/* ─── Animated Counter ─── */

type AnimatedCounterProps = {
  value: number | null;
  fallback: string;
  digitClassName?: string;
};

function AnimatedCounter({ value, fallback, digitClassName = "" }: AnimatedCounterProps) {
  if (value === null) {
    return <span className="stats-fallback">{fallback}</span>;
  }

  const formatted = numberFormatter.format(value);

  return (
    <span className="animated-counter" aria-label={formatted}>
      {formatted.split("").map((character, index) => {
        if (/\d/.test(character)) {
          return (
            <span key={`${character}-${index}`} className={`digit-slot ${digitClassName}`.trim()} aria-hidden="true">
              <span
                className="digit-reel"
                style={{ transform: `translateY(-${Number(character) * 10}%)` }}
              >
                {Array.from({ length: 10 }, (_, digit) => (
                  <span key={digit} className="digit-face">
                    {digit}
                  </span>
                ))}
              </span>
            </span>
          );
        }

        return (
          <span key={`${character}-${index}`} className="digit-separator" aria-hidden="true">
            {character}
          </span>
        );
      })}
    </span>
  );
}

/* ─── App ─── */

export function App() {
  const pageRef = useRef<HTMLDivElement>(null);
  const tracingBeamRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveStats, setLiveStats] = useState<LiveStatsState>(() => ({
    totalVisits: 0,
    activePlayers: 0,
    trackedGames: robloxGames.length,
    updatedAt: null,
    status: "loading",
    games: makeInitialGames(),
  }));

  const activeSection = useActiveSection();
  const { progress, showTopBtn } = useScrollProgress();
  const { displayed: typewriterText, done: typewriterDone } = useTypewriter("Roblox Scripter", 80, 800);

  useScrollReveal();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  /* Pointer tracking */
  useEffect(() => {
    const element = pageRef.current;

    if (!element) {
      return;
    }

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let frameId = 0;

    const syncPointer = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      const shiftX = ((currentX / window.innerWidth) - 0.5) * 70;
      const shiftY = ((currentY / window.innerHeight) - 0.5) * 70;

      element.style.setProperty("--pointer-x", `${currentX.toFixed(1)}px`);
      element.style.setProperty("--pointer-y", `${currentY.toFixed(1)}px`);
      element.style.setProperty("--pointer-shift-x", `${shiftX.toFixed(1)}px`);
      element.style.setProperty("--pointer-shift-y", `${shiftY.toFixed(1)}px`);

      frameId = window.requestAnimationFrame(syncPointer);
    };

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const resetPointer = () => {
      targetX = window.innerWidth / 2;
      targetY = window.innerHeight / 2;
    };

    const handleResize = () => {
      resetPointer();
    };

    syncPointer();

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* Tracing beam */
  useEffect(() => {
    const beamElement = tracingBeamRef.current;

    if (!beamElement) {
      return;
    }

    const syncBeam = () => {
      const pageHeight = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(window.scrollY / pageHeight, 0), 1);
      beamElement.style.setProperty("--beam-progress", scrollProgress.toFixed(4));
    };

    syncBeam();
    window.addEventListener("scroll", syncBeam, { passive: true });
    window.addEventListener("resize", syncBeam);

    return () => {
      window.removeEventListener("scroll", syncBeam);
      window.removeEventListener("resize", syncBeam);
    };
  }, []);

  /* Live stats */
  useEffect(() => {
    let isActive = true;
    let intervalId = 0;
    let requestInFlight = false;

    const loadStats = async () => {
      try {
        const universeResolution = await Promise.all(
          robloxGames.map(async (game) => {
            if (game.universeId) {
              return { placeId: game.placeId, universeId: game.universeId };
            }

            try {
              const universeId = await fetchUniverseIdForPlace(game.placeId);
              return { placeId: game.placeId, universeId };
            } catch {
              return { placeId: game.placeId, universeId: null };
            }
          }),
        );

        const universeIdByPlace = new Map<string, string>();

        universeResolution.forEach((entry) => {
          if (entry.universeId) {
            universeIdByPlace.set(entry.placeId, entry.universeId);
          }
        });

        const baseTrackedGames = robloxGames.map((game) => ({
          ...game,
          universeId: universeIdByPlace.get(game.placeId) ?? game.universeId ?? null,
          playing: null,
          visits: null,
          thumbnailUrl: null,
        }));

        const universeIds = baseTrackedGames
          .map((game) => game.universeId)
          .filter((value): value is string => Boolean(value));

        const thumbnailByUniverse = new Map<string, string>();

        if (universeIds.length > 0) {
          try {
            const thumbnailMap = await fetchThumbnailMap(universeIds);
            thumbnailMap.forEach((value, key) => {
              thumbnailByUniverse.set(key, value);
            });
          } catch {
            // Thumbnails are optional.
          }
        }

        const trackedGames = baseTrackedGames.map((game) => ({
          ...game,
          thumbnailUrl: game.universeId ? thumbnailByUniverse.get(game.universeId) ?? null : null,
        }));

        if (!isActive) {
          return;
        }

        setLiveStats((current) => ({
          ...current,
          status: "loading",
          games: trackedGames,
        }));

        const refreshLiveStats = async () => {
          if (!isActive || requestInFlight) {
            return;
          }

          requestInFlight = true;

          try {
            if (universeIds.length === 0) {
              throw new Error("No Roblox universe IDs were resolved.");
            }

            const liveEntries = await fetchLiveGameEntries(universeIds);
            const liveByUniverse = new Map<string, RobloxApiItem>();

            liveEntries.forEach((item) => {
              const universeId = readId(item.id);

              if (universeId) {
                liveByUniverse.set(universeId, item);
              }
            });

            const hydratedGames = trackedGames.map((game) => {
              const liveEntry = game.universeId ? liveByUniverse.get(game.universeId) : undefined;
              const apiName = readText(liveEntry?.name) ?? game.title;

              return {
                ...game,
                title: apiName,
                playing: readInteger(liveEntry?.playing),
                visits: readInteger(liveEntry?.visits),
              };
            });

            const resolvedVisitsCount = hydratedGames.filter((game) => game.visits !== null).length;
            const resolvedPlayersCount = hydratedGames.filter((game) => game.playing !== null).length;
            const totalVisits = hydratedGames.reduce((sum, game) => sum + (game.visits ?? 0), 0);
            const activePlayers = hydratedGames.reduce((sum, game) => sum + (game.playing ?? 0), 0);

            if (!isActive) {
              return;
            }

            setLiveStats({
              totalVisits,
              activePlayers,
              trackedGames: robloxGames.length,
              updatedAt: resolvedVisitsCount > 0 || resolvedPlayersCount > 0 ? Date.now() : null,
              status: resolvedVisitsCount > 0 || resolvedPlayersCount > 0 ? "live" : "error",
              games: hydratedGames,
            });
          } catch {
            if (!isActive) {
              return;
            }

            setLiveStats((current) => ({
              ...current,
              updatedAt: current.updatedAt,
              status: current.updatedAt ? "live" : "error",
            }));
          } finally {
            requestInFlight = false;
          }
        };

        await refreshLiveStats();

        if (!isActive) {
          return;
        }

        intervalId = window.setInterval(() => {
          void refreshLiveStats();
        }, 1000);
      } catch {
        if (!isActive) {
          return;
        }

        setLiveStats((current) => ({
          ...current,
          status: "error",
        }));
      }
    };

    void loadStats();

    return () => {
      isActive = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  /* Lock body scroll when menu open */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const totalVisitsValue = liveStats.updatedAt !== null ? liveStats.totalVisits : null;
  const totalVisitsFallback = liveStats.status === "error" ? "Unavailable" : "Loading...";
  const activePlayersValue = liveStats.updatedAt !== null ? liveStats.activePlayers : null;
  const activePlayersFallback = liveStats.status === "error" ? "Unavailable" : "Loading...";
  const gamesWorkedOnValue = liveStats.trackedGames;
  const gamesWorkedOnLabel = numberFormatter.format(liveStats.trackedGames);

  return (
    <div ref={pageRef} className="portfolio-shell min-h-screen overflow-hidden text-white">
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* Scene Backdrop */}
      <div className="scene-backdrop absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="cursor-core" />
        <div className="cursor-light" />
        <div className="cursor-light cursor-light--soft" />
        <div className="scene-vignette" />
        <div className="scene-grid" />
        <div className="scene-noise" />
        <div className="scene-wave scene-wave--one" />
        <div className="scene-wave scene-wave--two" />
        <div className="scene-wave scene-wave--three" />

        <div className="ring ring--one" />
        <div className="ring ring--two" />
        <div className="ring ring--three" />

        <div className="energy-orb energy-orb--one" />
        <div className="energy-orb energy-orb--two" />
        <div className="energy-orb energy-orb--three" />

        <div className="beam-field">
          {beamLines.map((beam, index) => (
            <span
              key={`${beam.left}-${beam.top}-${index}`}
              className="beam"
              style={{
                left: beam.left,
                top: beam.top,
                width: beam.width,
                animationDuration: beam.duration,
                animationDelay: beam.delay,
              }}
            />
          ))}
        </div>

        <div className="particle-field">
          {particles.map((particle, index) => (
            <span
              key={`${particle.left}-${particle.top}-${index}`}
              className="particle"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                left: particle.left,
                top: particle.top,
                animationDuration: particle.duration,
                animationDelay: particle.delay,
              }}
            />
          ))}
        </div>
      </div>

      {/* Tracing Beam */}
      <div ref={tracingBeamRef} className="page-tracing-beam" aria-hidden="true">
        <span className="page-tracing-beam__rail" />
        <span className="page-tracing-beam__glow" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/40">
              CA
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Caden Arabic</p>
              <p className="text-xs text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Roblox scripter</p>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 text-sm text-slate-300 md:flex">
            {navSections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`nav-link button-hover transition hover:text-cyan-300 ${
                  activeSection === section ? "nav-link--active" : ""
                }`}
              >
                {section === "stats" ? "Live Stats" : section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
          </nav>

          {/* Mobile Hamburger */}
          <button
            className={`hamburger md:hidden ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu-backdrop ${menuOpen ? "open" : ""}`} onClick={closeMenu} />
      <div className={`mobile-menu-panel ${menuOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <p className="text-lg font-bold text-white">Menu</p>
          <button
            className={`hamburger ${menuOpen ? "open" : ""}`}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav className="py-2">
          {navSections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="mobile-menu-link"
              onClick={closeMenu}
            >
              {section === "stats" ? "Live Stats" : section.charAt(0).toUpperCase() + section.slice(1)}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main id="home" className="pb-12">
        <div className="content-with-beam mx-auto max-w-6xl px-6">
          {/* Hero Section */}
          <section className="pb-6 pt-16 md:pt-20">
            <div className="section-panel section-panel--blue grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-10 lg:p-12">
              <div className="space-y-8">
                <div className="reveal hero-badge inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
                  <span className="hero-badge-dot h-2 w-2 rounded-full bg-cyan-300" />
                  Roblox scripter
                </div>

                <div className="space-y-5">
                  <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                    Caden Arabic
                    <br />
                    <span className="gradient-text-animated">
                      {typewriterText}
                      {!typewriterDone && <span className="typewriter-cursor" />}
                    </span>
                  </h1>
                </div>

                <div className="reveal stagger-2 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="#stats"
                    className="button-hover inline-flex items-center justify-center rounded-2xl bg-cyan-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
                  >
                    View Live Stats
                  </a>
                  <a
                    href="#games"
                    className="button-hover inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"
                  >
                    Games Worked On
                  </a>
                </div>

                <div className="flex flex-wrap gap-3">
                  {skillPills.map((skill, index) => (
                    <span
                      key={skill}
                      className={`reveal skill-pill rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-100 backdrop-blur-sm stagger-${index + 1}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="reveal-right rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Portfolio Snapshot</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Caden Arabic</h2>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="reveal-scale stagger-1 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Experience</p>
                    <p className="mt-3 text-2xl font-black text-white">4+ Years</p>
                  </div>
                  <div className="reveal-scale stagger-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Projects</p>
                    <p className="mt-3 text-2xl font-black text-white">{gamesWorkedOnLabel}</p>
                  </div>
                  <div className="reveal-scale stagger-3 hero-focus-card rounded-2xl border border-cyan-300/20 bg-cyan-400/5 p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300" style={{ fontFamily: "var(--font-mono)" }}>Focus</p>
                    <p className="mt-3 max-w-[10ch] text-base font-black leading-tight text-white sm:text-lg">
                      Brainrots Games
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-6">
            <div className="section-panel section-panel--cyan p-8 md:p-10">
              <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100" style={{ fontFamily: "var(--font-mono)" }}>About</p>
              <h2 className="reveal stagger-1 mt-4 text-3xl font-bold text-white md:text-4xl">Caden Arabic</h2>
              <p className="reveal stagger-2 mt-5 max-w-3xl text-lg leading-8 text-slate-100">
                Roblox experienced scripter with 4+ years of experience.
              </p>
            </div>
          </section>

          {/* Stats Section */}
          <section id="stats" className="py-6">
            <div className="section-panel section-panel--blue p-8 md:p-10">
              <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100" style={{ fontFamily: "var(--font-mono)" }}>
                    Live Stats
                  </p>
                  <h2 className="reveal stagger-1 mt-3 text-3xl font-bold text-white">Real-time totals across my Roblox work</h2>
                </div>
              </div>

              <div className="reveal stagger-2 stats-strip" aria-live="polite">
                <div className="stats-strip__item">
                  <p className="stats-strip__label">Total Visits :</p>
                  <div className="stats-strip__value">
                    <AnimatedCounter value={totalVisitsValue} fallback={totalVisitsFallback} />
                  </div>
                </div>
                <div className="stats-strip__item">
                  <p className="stats-strip__label">Active Players :</p>
                  <div className="stats-strip__value">
                    <AnimatedCounter value={activePlayersValue} fallback={activePlayersFallback} />
                  </div>
                </div>
                <div className="stats-strip__item">
                  <p className="stats-strip__label">Games Worked On :</p>
                  <div className="stats-strip__value">
                    <AnimatedCounter value={gamesWorkedOnValue} fallback={gamesWorkedOnLabel} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services Section */}
          <section id="services" className="py-6">
            <div className="section-panel section-panel--cyan p-8 md:p-10">
              <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200" style={{ fontFamily: "var(--font-mono)" }}>
                    Services
                  </p>
                  <h2 className="reveal stagger-1 mt-3 text-3xl font-bold text-white">What I can script for Roblox games</h2>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {services.map((service, index) => (
                  <CometCard key={service.title} className={`reveal-scale stagger-${index + 1} h-full`}>
                    <article className="h-full rounded-3xl border border-white/10 bg-slate-950/35 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-slate-950/45">
                      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.14)]">
                        <ServiceIcon type={service.icon} />
                      </div>
                      <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                      <p className="mt-3 leading-7 text-slate-300">{service.description}</p>
                    </article>
                  </CometCard>
                ))}
              </div>
            </div>
          </section>

          {/* Games Section */}
          <section id="games" className="py-6">
            <div className="section-panel section-panel--blue p-8 md:p-10">
              <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200" style={{ fontFamily: "var(--font-mono)" }}>
                    Games Worked On
                  </p>
                  <h2 className="reveal stagger-1 mt-3 text-3xl font-bold text-white">Tracked Roblox experiences</h2>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                {liveStats.games.map((game, index) => (
                  <CometCard key={game.placeId} className={`reveal-scale stagger-${Math.min(index + 1, 10)} h-full`}>
                    <article className="game-card group h-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 backdrop-blur-sm">
                      <div className="relative h-52 overflow-hidden border-b border-white/10 bg-slate-900">
                        {game.thumbnailUrl ? (
                          <img
                            src={game.thumbnailUrl}
                            alt={game.title}
                            className="game-thumb h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="game-thumb flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/20 via-slate-900 to-blue-500/20 px-6 text-center">
                            <div>
                              <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/80" style={{ fontFamily: "var(--font-mono)" }}>Roblox Game</p>
                              <p className="mt-3 text-2xl font-black text-white">{String(index + 1).padStart(2, "0")}</p>
                            </div>
                          </div>
                        )}
                        <div className="game-overlay absolute inset-0" />
                        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md" style={{ fontFamily: "var(--font-mono)" }}>
                          Roblox Experience
                        </div>
                      </div>

                      <div className="space-y-5 p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                            <p className="mt-2 text-sm text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Place ID: {game.placeId}</p>
                          </div>
                          <span className="text-4xl font-black text-white/10">{String(index + 1).padStart(2, "0")}</span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Active Players</p>
                            <p className="mt-2 text-xl font-semibold text-white">
                              {formatMetric(game.playing, "Syncing")}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Visits</p>
                            <p className="mt-2 text-xl font-semibold text-white">
                              {formatMetric(game.visits, "Syncing")}
                            </p>
                          </div>
                        </div>

                        <a
                          href={game.url}
                          target="_blank"
                          rel="noreferrer"
                          className="button-hover inline-flex items-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/45 hover:bg-cyan-300/15"
                        >
                          Open game page
                          <LinkArrowIcon />
                        </a>
                      </div>
                    </article>
                  </CometCard>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-6">
            <div className="section-panel section-panel--cyan p-8 md:p-10">
              <p className="reveal text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100" style={{ fontFamily: "var(--font-mono)" }}>Contact</p>
              <h2 className="reveal stagger-1 mt-4 text-3xl font-bold text-white md:text-4xl">Let&apos;s connect</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <a
                  href="https://x.com/Caden__Pro"
                  target="_blank"
                  rel="noreferrer"
                  className="reveal-scale stagger-1 button-hover rounded-3xl border border-white/10 bg-slate-950/35 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-slate-950/45"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Twitter (X)</p>
                  <p className="mt-3 text-xl font-bold text-white">@Caden__Pro</p>
                  <p className="mt-2 text-sm text-slate-300">x.com/Caden__Pro</p>
                </a>

                <div className="reveal-scale stagger-2 rounded-3xl border border-white/10 bg-slate-950/35 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Discord</p>
                  <p className="mt-3 text-xl font-bold text-white">caden._.arabic</p>
                  <p className="mt-2 text-sm text-slate-300">Add me on Discord</p>
                </div>

                <a
                  href="https://www.roblox.com/users/867951875/profile"
                  target="_blank"
                  rel="noreferrer"
                  className="reveal-scale stagger-3 button-hover rounded-3xl border border-white/10 bg-slate-950/35 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-slate-950/45"
                >
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-400" style={{ fontFamily: "var(--font-mono)" }}>Roblox</p>
                  <p className="mt-3 text-xl font-bold text-white">Profile</p>
                  <p className="mt-2 text-sm text-slate-300">roblox.com/users/867951875/profile</p>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500" style={{ fontFamily: "var(--font-mono)" }}>
        Caden Arabic • Roblox scripter • Live totals for visits, active players, and games worked on.
      </footer>

      {/* Scroll To Top */}
      <button
        className={`scroll-top-btn ${showTopBtn ? "visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <ChevronUpIcon />
      </button>
    </div>
  );
}
