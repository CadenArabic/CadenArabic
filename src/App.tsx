import { useEffect, useRef, useState } from "react";

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
};

const robloxGames: GameEntry[] = [
  {
    title: "Escape Train for Brainrots",
    url: "https://www.roblox.com/games/93014298159631/Escape-Train-for-Brainrots",
    placeId: "93014298159631",
  },
  {
    title: "Escape Falling Stairs for Brainrot",
    url: "https://www.roblox.com/games/116990588746086/Escape-Falling-Stairs-for-Brainrot",
    placeId: "116990588746086",
  },
  {
    title: "Four in a Row",
    url: "https://www.roblox.com/games/118638953131946/Four-in-a-Row",
    placeId: "118638953131946",
  },
  {
    title: "Steal a Celebrity",
    url: "https://www.roblox.com/games/96771164438323/Steal-a-Celebrity",
    placeId: "96771164438323",
  },
  {
    title: "Feed Your Pets",
    url: "https://www.roblox.com/games/140049315593804/Feed-Your-Pets",
    placeId: "140049315593804",
  },
  {
    title: "Samurai Troll Tower",
    url: "https://www.roblox.com/games/115768905804211/Samurai-Troll-Tower",
    placeId: "115768905804211",
  },
  {
    title: "Fling a Brainrot",
    url: "https://www.roblox.com/games/93108774146455/Fling-a-Brainrot",
    placeId: "93108774146455",
  },
  {
    title: "Dangerous RV Driving",
    url: "https://www.roblox.com/games/78758085598611/Dangerous-RV-Driving",
    placeId: "78758085598611",
  },
  {
    title: "Steal Brainrots Trading Plaza",
    url: "https://www.roblox.com/games/139217467707445/Steal-Brainrots-Trading-Plaza",
    placeId: "139217467707445",
  },
];

const floatingCubes = [
  { size: 52, left: "6%", top: "10%", duration: "20s", delay: "-3s" },
  { size: 84, left: "14%", top: "65%", duration: "26s", delay: "-8s" },
  { size: 44, left: "24%", top: "18%", duration: "18s", delay: "-4s" },
  { size: 96, left: "36%", top: "74%", duration: "29s", delay: "-9s" },
  { size: 68, left: "46%", top: "14%", duration: "21s", delay: "-7s" },
  { size: 116, left: "58%", top: "28%", duration: "31s", delay: "-6s" },
  { size: 54, left: "64%", top: "62%", duration: "19s", delay: "-11s" },
  { size: 72, left: "76%", top: "12%", duration: "22s", delay: "-5s" },
  { size: 46, left: "82%", top: "72%", duration: "17s", delay: "-10s" },
  { size: 38, left: "90%", top: "24%", duration: "16s", delay: "-2s" },
  { size: 62, left: "71%", top: "42%", duration: "24s", delay: "-12s" },
  { size: 58, left: "28%", top: "48%", duration: "23s", delay: "-1s" },
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

const numberFormatter = new Intl.NumberFormat("en-US");

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
    universeId: null,
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

const formatMetric = (value: number | null, loadingText = "Loading...") => {
  if (value === null) {
    return loadingText;
  }

  return numberFormatter.format(value);
};

const fetchJsonWithFallback = async (urls: string[]) => {
  let lastError: Error | null = null;

  for (const url of urls) {
    const controller = new AbortController();
    const timeoutId = globalThis.setTimeout(() => controller.abort(), 7000);

    try {
      const response = await fetch(url, {
        headers: {
          accept: "application/json",
        },
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

  throw lastError ?? new Error("Failed to fetch Roblox data");
};

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

export function App() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [liveStats, setLiveStats] = useState<LiveStatsState>(() => ({
    totalVisits: 0,
    activePlayers: 0,
    trackedGames: robloxGames.length,
    updatedAt: null,
    status: "loading",
    games: makeInitialGames(),
  }));

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

  useEffect(() => {
    let isActive = true;
    let intervalId = 0;
    let requestInFlight = false;

    const loadStats = async () => {
      try {
        const placeIds = robloxGames.map((game) => game.placeId).join(",");
        const placeDetailsPayload = await fetchJsonWithFallback([
          `https://games.roproxy.com/v1/games/multiget-place-details?placeIds=${placeIds}`,
          `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeIds}`,
        ]);

        const placeDetails = readApiArray(placeDetailsPayload);
        const universeIdByPlace = new Map<string, string>();

        placeDetails.forEach((item) => {
          const placeId = typeof item.placeId === "string" || typeof item.placeId === "number"
            ? String(item.placeId)
            : null;
          const universeId = typeof item.universeId === "string" || typeof item.universeId === "number"
            ? String(item.universeId)
            : null;

          if (placeId && universeId) {
            universeIdByPlace.set(placeId, universeId);
          }
        });

        const baseTrackedGames = robloxGames.map((game) => ({
          ...game,
          universeId: universeIdByPlace.get(game.placeId) ?? null,
          playing: null,
          visits: null,
          thumbnailUrl: null,
        }));

        const universeIds = baseTrackedGames
          .map((game) => game.universeId)
          .filter((value): value is string => Boolean(value));

        if (universeIds.length === 0) {
          throw new Error("No Roblox universe IDs were resolved.");
        }

        const thumbnailByUniverse = new Map<string, string>();

        try {
          const thumbnailPayload = await fetchJsonWithFallback([
            `https://thumbnails.roproxy.com/v1/games/icons?universeIds=${universeIds.join(",")}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
            `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds.join(",")}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
          ]);

          const thumbnailEntries = readApiArray(thumbnailPayload);

          thumbnailEntries.forEach((item) => {
            const targetId = typeof item.targetId === "string" || typeof item.targetId === "number"
              ? String(item.targetId)
              : null;
            const imageUrl = readText(item.imageUrl);

            if (targetId && imageUrl) {
              thumbnailByUniverse.set(targetId, imageUrl);
            }
          });
        } catch {
          // Thumbnails are optional, so the site can continue without them.
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
            const livePayload = await fetchJsonWithFallback([
              `https://games.roproxy.com/v1/games?universeIds=${universeIds.join(",")}`,
              `https://games.roblox.com/v1/games?universeIds=${universeIds.join(",")}`,
            ]);

            const liveEntries = readApiArray(livePayload);
            const liveByUniverse = new Map<string, RobloxApiItem>();

            liveEntries.forEach((item) => {
              const universeId = typeof item.id === "string" || typeof item.id === "number"
                ? String(item.id)
                : null;

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

            const totalVisits = hydratedGames.reduce((sum, game) => sum + (game.visits ?? 0), 0);
            const activePlayers = hydratedGames.reduce((sum, game) => sum + (game.playing ?? 0), 0);

            if (!isActive) {
              return;
            }

            setLiveStats({
              totalVisits,
              activePlayers,
              trackedGames: robloxGames.length,
              updatedAt: Date.now(),
              status: "live",
              games: hydratedGames,
            });
          } catch {
            if (!isActive) {
              return;
            }

            setLiveStats((current) => ({
              ...current,
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

  const totalVisitsLabel = liveStats.updatedAt !== null
    ? numberFormatter.format(liveStats.totalVisits)
    : "Loading...";
  const activePlayersLabel = liveStats.updatedAt !== null
    ? numberFormatter.format(liveStats.activePlayers)
    : "Loading...";
  const gamesWorkedOnLabel = numberFormatter.format(liveStats.trackedGames);

  return (
    <div ref={pageRef} className="portfolio-shell min-h-screen overflow-hidden bg-slate-950 text-white">
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

        <div className="cube-field">
          {floatingCubes.map((cube, index) => (
            <span
              key={`${cube.left}-${cube.top}-${index}`}
              className="cube"
              style={{
                width: `${cube.size}px`,
                height: `${cube.size}px`,
                left: cube.left,
                top: cube.top,
                animationDuration: cube.duration,
                animationDelay: cube.delay,
              }}
            />
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/55 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/40">
              CA
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Caden Arabic</p>
              <p className="text-xs text-slate-400">Roblox scripter</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#about" className="nav-link button-hover transition hover:text-cyan-300">
              About
            </a>
            <a href="#stats" className="nav-link button-hover transition hover:text-cyan-300">
              Live Stats
            </a>
            <a href="#services" className="nav-link button-hover transition hover:text-cyan-300">
              Services
            </a>
            <a href="#games" className="nav-link button-hover transition hover:text-cyan-300">
              Games
            </a>
            <a href="#contact" className="nav-link button-hover transition hover:text-cyan-300">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main id="home" className="pb-12">
        <section className="mx-auto max-w-6xl px-6 pb-6 pt-16 md:pt-20">
          <div className="section-panel section-panel--blue grid gap-10 p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-10 lg:p-12">
            <div className="space-y-8">
              <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 shadow-[0_0_40px_rgba(34,211,238,0.12)]">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Roblox scripter
              </div>

              <div className="space-y-5">
                <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                  Caden Arabic
                  <span className="bg-gradient-to-r from-cyan-200 via-sky-200 to-blue-300 bg-clip-text text-transparent">
                    {" "}Roblox Scripter
                  </span>
                </h1>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
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
                {skillPills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-pill rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-100 backdrop-blur-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Portfolio Snapshot</p>
                  <h2 className="mt-2 text-2xl font-bold text-white">Caden Arabic</h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Experience</p>
                  <p className="mt-3 text-2xl font-black text-white">4+ Years</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Projects</p>
                  <p className="mt-3 text-2xl font-black text-white">{gamesWorkedOnLabel}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Focus</p>
                  <p className="mt-3 text-xl font-black leading-tight text-white sm:text-2xl">Brainrots Games</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-6 py-6">
          <div className="section-panel section-panel--cyan p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100">About</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Caden Arabic</h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-100">
              Roblox experienced scripter with 4+ years of experience.
            </p>
          </div>
        </section>

        <section id="stats" className="mx-auto max-w-6xl px-6 py-6">
          <div className="section-panel section-panel--blue p-8 md:p-10">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100">
                  Live Stats
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">Real-time totals across my Roblox work</h2>
              </div>
            </div>

            <div className="stats-strip" aria-live="polite">
              <div className="stats-strip__item">
                <p className="stats-strip__label">Total Visits :</p>
                <p className="stats-strip__value">{totalVisitsLabel}</p>
              </div>
              <div className="stats-strip__item">
                <p className="stats-strip__label">Active Players :</p>
                <p className="stats-strip__value">{activePlayersLabel}</p>
              </div>
              <div className="stats-strip__item">
                <p className="stats-strip__label">Games Worked On :</p>
                <p className="stats-strip__value">{gamesWorkedOnLabel}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-6 py-6">
          <div className="section-panel section-panel--cyan p-8 md:p-10">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  Services
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">What I can script for Roblox games</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="rounded-3xl border border-white/10 bg-slate-950/35 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-slate-950/45"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/20 bg-cyan-300/10 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.14)]">
                    <ServiceIcon type={service.icon} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="games" className="mx-auto max-w-6xl px-6 py-6">
          <div className="section-panel section-panel--blue p-8 md:p-10">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                  Games Worked On
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">Tracked Roblox experiences</h2>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {liveStats.games.map((game, index) => (
                <article
                  key={game.placeId}
                  className="game-card group overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 backdrop-blur-sm"
                >
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
                          <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/80">Roblox Game</p>
                          <p className="mt-3 text-2xl font-black text-white">{String(index + 1).padStart(2, "0")}</p>
                        </div>
                      </div>
                    )}
                    <div className="game-overlay absolute inset-0" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-slate-950/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                      Roblox Experience
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{game.title}</h3>
                        <p className="mt-2 text-sm text-slate-400">Place ID: {game.placeId}</p>
                      </div>
                      <span className="text-4xl font-black text-white/10">{String(index + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Active Players</p>
                        <p className="mt-2 text-xl font-semibold text-white">
                          {formatMetric(game.playing, "Syncing")}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Visits</p>
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
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-6xl px-6 py-6">
          <div className="section-panel section-panel--cyan p-8 md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-100">Contact</p>
            <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">Let&apos;s connect</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <a
                href="https://x.com/Caden__Pro"
                target="_blank"
                rel="noreferrer"
                className="button-hover rounded-3xl border border-white/10 bg-slate-950/35 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-slate-950/45"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Twitter (X)</p>
                <p className="mt-3 text-xl font-bold text-white">@Caden__Pro</p>
                <p className="mt-2 text-sm text-slate-300">x.com/Caden__Pro</p>
              </a>

              <div className="rounded-3xl border border-white/10 bg-slate-950/35 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Discord</p>
                <p className="mt-3 text-xl font-bold text-white">caden._.arabic</p>
                <p className="mt-2 text-sm text-slate-300">Add me on Discord</p>
              </div>

              <a
                href="https://www.roblox.com/users/867951875/profile"
                target="_blank"
                rel="noreferrer"
                className="button-hover rounded-3xl border border-white/10 bg-slate-950/35 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-slate-950/45"
              >
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Roblox</p>
                <p className="mt-3 text-xl font-bold text-white">Profile</p>
                <p className="mt-2 text-sm text-slate-300">roblox.com/users/867951875/profile</p>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-sm text-slate-500">
        Caden Arabic • Roblox scripting portfolio • Live totals for visits, active players, and games worked on.
      </footer>
    </div>
  );
}
