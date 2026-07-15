import { useCallback, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp, FiHome, FiLock, FiMapPin, FiPackage, FiRefreshCw, FiUsers, FiZap } from "react-icons/fi";
import { GiBookshelf } from "react-icons/gi";
import { hasFeature, savToMap, type SaveGuild } from "@palserver/shared";
import type { AgentClient } from "./api";
import { useGameData, displayName, findCharacter, itemIconUrl, type GameData } from "./gameData";
import { t, useI18n } from "./i18n";
import { btnGhost, card, errorCls } from "./ui";

/**
 * 公會分頁 — 存檔快照(save-tools 掃描)驅動的公會總覽:
 * 成員(含離線與最後上線)、據點(可跳地圖)、據點駐守帕魯、公會倉庫、研究進度。
 * 不依賴 PalDefender;資料是「上次掃描時」的狀態,按「從存檔刷新」重掃。
 * 贊助者功能(save-slim)。
 */
export function GuildsTab({
  client,
  instanceId,
  onShowOnMap,
}: {
  client: AgentClient;
  instanceId: string;
  /** 切到地圖分頁並聚焦(地圖座標) */
  onShowOnMap?: (x: number, y: number) => void;
}) {
  useI18n();
  const gameData = useGameData();
  const [entitled, setEntitled] = useState<boolean | null>(null);
  const [worldGuid, setWorldGuid] = useState<string | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [guilds, setGuilds] = useState<SaveGuild[] | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [canScan, setCanScan] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .license()
      .then((l) => setEntitled(hasFeature("save-slim", l)))
      .catch(() => setEntitled(false));
  }, [client, instanceId]);

  const load = useCallback(async () => {
    try {
      const snap = await client.guildsSnapshot(instanceId);
      setWorldGuid(snap.worldGuid);
      setGeneratedAt(snap.generatedAt);
      setGuilds(snap.guilds);
      setNote(null);
      try {
        const health = await client.saveHealth(instanceId, snap.worldGuid);
        setCanScan(health.supported);
        if (!health.supported) setNote(health.reason ?? t("此主機不支援存檔掃描"));
      } catch {
        setCanScan(false);
      }
    } catch (err) {
      setCanScan(false);
      setNote(t("無法取得存檔快照:{reason}", { reason: err instanceof Error ? err.message : String(err) }));
    }
  }, [client, instanceId]);

  useEffect(() => {
    if (entitled) void load();
  }, [entitled, load]);

  const scan = async () => {
    if (!worldGuid) return;
    setError(null);
    setScanning(true);
    try {
      await client.startSaveHealth(instanceId, worldGuid);
      await new Promise<void>((resolve) => {
        const timer = setInterval(async () => {
          try {
            const s = await client.saveHealth(instanceId, worldGuid);
            if (s.phase === "idle") {
              clearInterval(timer);
              if (s.error) setError(s.error);
              resolve();
            }
          } catch {
            /* 暫時性網路錯誤:下一輪再試 */
          }
        }, 2000);
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setScanning(false);
    }
  };

  if (entitled === false) {
    return (
      <div className="inline-flex items-center gap-2 rounded-cute border-2 border-sun/40 bg-sun/10 px-3 py-2 text-xs font-bold text-sun">
        <FiLock className="size-4 shrink-0" />
        {t("公會總覽是贊助者功能。到「設定 → 贊助者識別碼」輸入識別碼即可使用。")}
      </div>
    );
  }
  if (entitled === null) return <p className="text-ink-muted">{t("載入中…")}</p>;

  const sorted = [...(guilds ?? [])].sort((a, b) => b.members.length - a.members.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-ink-muted">
          {generatedAt
            ? t("資料來自存檔掃描(掃描於 {when})。", { when: new Date(generatedAt).toLocaleString() })
            : t("尚未掃描過存檔。點「從存檔刷新」建立快照。")}
        </p>
        {canScan && (
          <button
            className={`${btnGhost} inline-flex items-center gap-1.5`}
            onClick={() => void scan()}
            disabled={scanning}
          >
            <FiRefreshCw className={`size-3.5 ${scanning ? "animate-spin" : ""}`} />
            {scanning ? t("掃描存檔中…(依存檔大小可能需要幾分鐘)") : t("從存檔刷新")}
          </button>
        )}
      </div>

      {error && <p className={errorCls}>{error}</p>}
      {note && !scanning && <p className="text-[13px] text-ink-muted">{note}</p>}

      {generatedAt && sorted.length === 0 && (
        <div className="rounded-cute border-2 border-dashed border-line px-6 py-10 text-center text-ink-muted">
          <FiHome className="mx-auto mb-2 size-11" />
          {t("這個世界還沒有公會。")}
        </div>
      )}

      {sorted.map((g) => (
        <GuildCard key={g.id} guild={g} gameData={gameData} onShowOnMap={onShowOnMap} />
      ))}
    </div>
  );
}

function GuildCard({
  guild,
  gameData,
  onShowOnMap,
}: {
  guild: SaveGuild;
  gameData: GameData | null;
  onShowOnMap?: (x: number, y: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const adminNorm = (guild.adminUid ?? "").replace(/[^0-9a-f]/gi, "").toLowerCase();
  const storageKinds = guild.storage?.length ?? 0;

  return (
    <div className={card}>
      <button className="flex w-full flex-wrap items-center justify-between gap-3 text-left" onClick={() => setOpen((v) => !v)}>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-extrabold">
            <FiHome className="size-4 shrink-0 text-pal" />
            <span className="truncate">{guild.name}</span>
            {guild.baseCampLevel !== null && (
              <span className="rounded-full bg-card-soft px-2 py-0.5 text-xs font-bold text-ink-muted">
                {t("據點等級 Lv.{n}", { n: guild.baseCampLevel })}
              </span>
            )}
          </p>
          <p className="mt-1 text-[13px] text-ink-muted">
            {t("{n} 名成員", { n: guild.members.length })} · {t("{n} 個據點", { n: guild.bases.length })}
            {guild.storage !== null && <> · {t("倉庫 {n} 種物品", { n: storageKinds })}</>}
            {guild.research && guild.research.currentId && (
              <> · {t("研究中:{id}", { id: prettifyResearchId(guild.research.currentId) })}</>
            )}
          </p>
        </div>
        {open ? <FiChevronUp className="size-4 shrink-0 text-ink-muted" /> : <FiChevronDown className="size-4 shrink-0 text-ink-muted" />}
      </button>

      {open && (
        <div className="mt-3 flex flex-col gap-4 border-t-2 border-line pt-3">
          {/* 成員 */}
          <div>
            <h4 className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-ink-muted">
              <FiUsers className="size-4 text-pal" /> {t("成員")}
              <span className="rounded-full bg-card-soft px-2 py-0.5 text-xs font-bold">{guild.members.length}</span>
            </h4>
            <div className="flex flex-col divide-y divide-line rounded-cute border-2 border-line">
              {guild.members.map((m) => {
                const isAdmin = m.uid.replace(/[^0-9a-f]/gi, "").toLowerCase() === adminNorm;
                return (
                  <div key={m.uid} className="flex flex-wrap items-center gap-x-3 px-3 py-1.5 text-[13px]">
                    <span className="min-w-28 font-bold">{m.name}</span>
                    {isAdmin && (
                      <span className="rounded-full bg-sun/15 px-2 py-0.5 text-xs font-bold text-sun">{t("會長")}</span>
                    )}
                    <span className="ml-auto text-xs text-ink-muted">
                      {m.lastOnlineDaysAgo === null
                        ? ""
                        : m.lastOnlineDaysAgo === 0
                          ? t("今天上線")
                          : t("{n} 天前上線", { n: m.lastOnlineDaysAgo })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 據點 + 駐守帕魯 */}
          {guild.bases.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-ink-muted">
                <FiMapPin className="size-4 text-pal" /> {t("據點")}
                <span className="rounded-full bg-card-soft px-2 py-0.5 text-xs font-bold">{guild.bases.length}</span>
              </h4>
              <div className="flex flex-col gap-2">
                {guild.bases.map((b, i) => {
                  const m = savToMap(b.x, b.y);
                  return (
                    <div key={b.id} className="rounded-cute border-2 border-line p-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[13px] font-bold">{b.name || t("據點 {n}", { n: i + 1 })}</span>
                        <span className="font-mono text-xs text-ink-muted">
                          ({Math.round(m.x)}, {Math.round(m.y)})
                        </span>
                        {onShowOnMap && (
                          <button
                            className="inline-flex items-center gap-1 rounded-full border-2 border-line px-2 py-0.5 text-xs font-bold text-ink-muted transition hover:border-pal hover:text-pal"
                            onClick={() => onShowOnMap(m.x, m.y)}
                          >
                            <FiMapPin className="size-3" /> {t("在地圖上查看")}
                          </button>
                        )}
                        <span className="ml-auto inline-flex items-center gap-1 text-xs text-ink-muted">
                          <FiZap className="size-3.5" /> {t("{n} 隻工作帕魯", { n: b.workers.length })}
                        </span>
                      </div>
                      {b.workers.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {b.workers.map((w, j) => {
                            const hit = findCharacter(gameData, w.characterId);
                            return (
                              <span
                                key={`${w.characterId}-${j}`}
                                className="inline-flex items-center gap-1 rounded-full bg-card-soft px-2 py-0.5 text-xs font-bold"
                                title={w.characterId}
                              >
                                {hit?.iconUrl && <img src={hit.iconUrl} alt="" className="size-4" />}
                                {hit ? displayName(hit.entity) : w.characterId}
                                {w.level !== null && <span className="font-mono font-normal text-ink-muted">Lv.{w.level}</span>}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 公會倉庫 */}
          {guild.storage !== null && guild.storage.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-ink-muted">
                <FiPackage className="size-4 text-pal" /> {t("公會倉庫")}
                <span className="rounded-full bg-card-soft px-2 py-0.5 text-xs font-bold">{guild.storage.length}</span>
              </h4>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2">
                {guild.storage.map(({ itemId, count }, i) => {
                  const entity = gameData?.itemById.get(itemId);
                  return (
                    <div key={`${itemId}-${i}`} className="flex items-center gap-2 rounded-xl border-2 border-line p-2">
                      {entity?.icon ? (
                        <img src={itemIconUrl(entity.icon)} alt="" className="size-8 shrink-0" />
                      ) : (
                        <span className="size-8 shrink-0 rounded bg-card-soft" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold">{entity ? displayName(entity) : itemId}</p>
                      </div>
                      <span className="shrink-0 text-sm font-extrabold text-pal">×{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 研究 */}
          {guild.research && guild.research.entries.length > 0 && (
            <div>
              <h4 className="mb-2 flex items-center gap-2 text-[13px] font-extrabold text-ink-muted">
                <GiBookshelf className="size-4 text-pal" /> {t("公會研究")}
                <span className="rounded-full bg-card-soft px-2 py-0.5 text-xs font-bold">
                  {guild.research.entries.length}
                </span>
                {guild.research.currentId && (
                  <span className="rounded-full bg-grass/10 px-2 py-0.5 text-xs font-bold text-grass">
                    {t("研究中:{id}", { id: prettifyResearchId(guild.research.currentId) })}
                  </span>
                )}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {guild.research.entries.map((r) => (
                  <span key={r.id} className="rounded-full bg-card-soft px-2 py-0.5 text-xs font-bold text-ink-muted" title={r.id}>
                    {prettifyResearchId(r.id)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** 研究 id 沒有現成的名稱對照表,先做可讀化(去前綴、底線轉空格)。 */
function prettifyResearchId(id: string): string {
  return id.replace(/^Research_/i, "").replace(/_/g, " ");
}
