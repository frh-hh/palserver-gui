import { useEffect, useState } from "react";
import { getLang } from "./i18n";

/** Catalogs of Palworld entities, for labelling IDs and picking icons.
 * Served as static JSON from /game-data (see public/game-data/CREDITS.md).
 * 載入後會在背景比對 GitHub raw 上的最新版,名稱翻譯改了不用重新出版。 */
export interface GameEntity {
  id: string;
  /** English name (always present) */
  name: string;
  /** Traditional-Chinese name where known; extend the catalogs to add more */
  zh?: string;
  /** Japanese name where known(scripts/fetch-game-data-i18n.mjs 由 paldb.cc 抓) */
  ja?: string;
  /** icon filename within the category folder, if we have artwork for it */
  icon?: string;
}

/** Preferred display name for the current UI language (fallback: English). */
export const displayName = (e: GameEntity) => {
  const lang = getLang();
  if (lang === "zh") return e.zh ?? e.name;
  if (lang === "ja") return e.ja ?? e.name;
  return e.name;
};

export interface GameData {
  pals: GameEntity[];
  items: GameEntity[];
  palById: Map<string, GameEntity>;
  itemById: Map<string, GameEntity>;
}

const REMOTE_BASE =
  "https://raw.githubusercontent.com/io-software-ai/palserver-gui/main/packages/web/public/game-data/";

let cache: GameData | null = null;
let inflight: Promise<GameData> | null = null;
const listeners = new Set<(d: GameData) => void>();

function build(pals: GameEntity[], items: GameEntity[]): GameData {
  return {
    pals,
    items,
    palById: new Map(pals.map((p) => [p.id, p])),
    itemById: new Map(items.map((i) => [i.id, i])),
  };
}

async function fetchCatalogs(base: string, opts?: RequestInit): Promise<[GameEntity[], GameEntity[]]> {
  return Promise.all([
    fetch(`${base}pals.json`, opts).then((r) => r.json() as Promise<GameEntity[]>),
    fetch(`${base}items.json`, opts).then((r) => r.json() as Promise<GameEntity[]>),
  ]);
}

async function load(): Promise<GameData> {
  if (cache) return cache;
  if (!inflight) {
    inflight = (async () => {
      const [pals, items] = await fetchCatalogs("/game-data/");
      cache = build(pals, items);
      void refreshFromRemote();
      return cache;
    })();
  }
  return inflight;
}

/** 背景抓 GitHub 上的最新目錄,跟 bundled 版不同就換上(本 session 一次)。 */
let refreshed = false;
async function refreshFromRemote(): Promise<void> {
  if (refreshed) return;
  refreshed = true;
  try {
    const [pals, items] = await fetchCatalogs(REMOTE_BASE, {
      cache: "no-cache",
      signal: AbortSignal.timeout(15000),
    });
    if (
      Array.isArray(pals) &&
      Array.isArray(items) &&
      pals.length > 0 &&
      items.length > 0 &&
      (JSON.stringify(pals) !== JSON.stringify(cache?.pals) ||
        JSON.stringify(items) !== JSON.stringify(cache?.items))
    ) {
      cache = build(pals, items);
      listeners.forEach((l) => l(cache!));
    }
  } catch {
    /* 離線或 GitHub 擋掉:用 bundled 版就好 */
  }
}

export function useGameData(): GameData | null {
  const [data, setData] = useState<GameData | null>(cache);
  useEffect(() => {
    listeners.add(setData);
    if (!cache) void load().then(setData).catch(() => setData(null));
    return () => {
      listeners.delete(setData);
    };
  }, []);
  return data;
}

export const palIconUrl = (icon: string) => `/game-data/pals/${icon}`;
export const itemIconUrl = (icon: string) => `/game-data/items/${icon}`;
