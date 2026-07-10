import { useCallback, useEffect, useState } from "react";
import { FiCopy, FiCheck, FiHome, FiGlobe, FiExternalLink, FiShield } from "react-icons/fi";
import type { ConnectionInfo } from "@palserver/shared";
import type { AgentClient } from "./api";
import { card, btnGhost } from "./ui";

/** "How do my friends join?" — the question every host actually asks, laid
 * out for non-technical users: same-network, VPN (Radmin / Tailscale), and
 * the advanced public route, each with a copy-ready address. */
export function ConnectionCard({ client, instanceId }: { client: AgentClient; instanceId: string }) {
  const [info, setInfo] = useState<ConnectionInfo | null>(null);

  const refresh = useCallback(() => {
    client.connection(instanceId).then(setInfo).catch(() => setInfo(null));
  }, [client, instanceId]);

  useEffect(() => refresh(), [refresh]);

  if (!info) return null;
  const port = info.gamePort;

  return (
    <div className={`${card} flex flex-col gap-4`}>
      <h3 className="inline-flex items-center gap-2 text-sm font-extrabold">
        <FiGlobe className="size-4 text-pal" /> 邀請朋友加入
      </h3>

      {/* 1) 同一個網路 */}
      <Section
        icon={<FiHome className="size-4 text-grass" />}
        title="同一個網路的朋友(同住/同一個 WiFi)"
        hint="最簡單,不用任何設定。把下面的位址給對方,在遊戲的「加入多人遊戲(專用伺服器)」貼上即可。"
      >
        {info.lan.length > 0 ? (
          info.lan.map((ip) => <AddressChip key={ip} address={`${ip}:${port}`} />)
        ) : (
          <p className="text-[13px] text-ink-muted">找不到區網位址。</p>
        )}
      </Section>

      {/* 2) VPN(推薦給遠端朋友) */}
      <Section
        icon={<FiShield className="size-4 text-pal" />}
        title="遠端的朋友 — 用 VPN 連線(推薦)"
        hint="不用動路由器、也不怕外網攻擊。你和朋友裝同一套免費 VPN、加入同一個網路,就像在同一個 WiFi 裡。"
      >
        {info.tailscale && (
          <div className="mb-2">
            <p className="mb-1 text-xs font-bold text-ink-muted">你的 Tailscale 位址:</p>
            <AddressChip address={`${info.tailscale}:${port}`} />
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <VpnOption
            name="Radmin VPN"
            desc="免註冊、建個房間邀朋友加入,最適合遊戲聯機。"
            site="https://www.radmin-vpn.com/"
            tutorial="https://www.youtube.com/results?search_query=Radmin+VPN+Palworld+%E8%81%AF%E6%A9%9F+%E6%95%99%E5%AD%B8"
          />
          <VpnOption
            name="Tailscale"
            desc="用 Google/GitHub 帳號登入,安全穩定,適合長期使用。"
            site="https://tailscale.com/"
            tutorial="https://www.youtube.com/results?search_query=Tailscale+Palworld+%E5%B0%88%E7%94%A8%E4%BC%BA%E6%9C%8D%E5%99%A8+%E6%95%99%E5%AD%B8"
          />
        </div>
      </Section>

      {/* 3) 公開連線(進階) */}
      <Section
        icon={<FiGlobe className="size-4 text-sun" />}
        title="開放公開連線(進階,不建議新手)"
        hint="讓任何人不裝 VPN 也能連,但需要在路由器設定「連接埠轉發」,且伺服器會曝露在網路上有安全風險。"
      >
        {info.publicIp ? (
          <>
            <p className="mb-1 text-xs font-bold text-ink-muted">你的公開位址:</p>
            <AddressChip address={`${info.publicIp}:${port}`} />
            {info.behindNat && (
              <p className="mt-2 text-xs text-sun">
                你的電腦在路由器後面 — 朋友要能連進來,需在路由器把 <b>UDP {port}</b> 轉發到這台電腦。
                若你用的是行動網路 / 部分光世代(CGNAT),可能沒有真正的公開 IP,這時只能用上面的 VPN 方式。
              </p>
            )}
            <a
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-pal hover:underline"
              href="https://www.youtube.com/results?search_query=%E8%B7%AF%E7%94%B1%E5%99%A8+%E9%80%A3%E6%8E%A5%E5%9F%A0+%E8%BD%89%E7%99%BC+port+forwarding+%E6%95%99%E5%AD%B8"
              target="_blank"
              rel="noreferrer"
            >
              <FiExternalLink className="size-3.5" /> 連接埠轉發教學影片
            </a>
          </>
        ) : (
          <p className="text-[13px] text-ink-muted">無法取得公開 IP(可能離線)。</p>
        )}
      </Section>

      <p className="text-xs text-ink-muted">
        提示:朋友連線用的是「遊戲埠 UDP {port}」。若朋友連不進來,先確認伺服器正在運作中、且防火牆有放行。
      </p>
    </div>
  );
}

function Section({
  icon,
  title,
  hint,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border-2 border-line p-3">
      <p className="inline-flex items-center gap-2 text-[13px] font-extrabold">
        {icon}
        {title}
      </p>
      <p className="mt-1 mb-2 text-xs text-ink-muted">{hint}</p>
      {children}
    </div>
  );
}

function AddressChip({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border-2 border-line bg-card-soft px-3 py-1.5 font-mono text-sm font-bold transition hover:border-pal"
      title="點擊複製"
    >
      {address}
      {copied ? <FiCheck className="size-4 text-grass" /> : <FiCopy className="size-4 text-ink-muted" />}
    </button>
  );
}

function VpnOption({
  name,
  desc,
  site,
  tutorial,
}: {
  name: string;
  desc: string;
  site: string;
  tutorial: string;
}) {
  return (
    <div className="rounded-xl bg-card-soft p-3">
      <p className="text-sm font-extrabold">{name}</p>
      <p className="mt-0.5 text-xs text-ink-muted">{desc}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          className={`${btnGhost} inline-flex items-center gap-1.5 px-3 py-1 text-xs`}
          href={site}
          target="_blank"
          rel="noreferrer"
        >
          <FiExternalLink className="size-3.5" /> 官方網站
        </a>
        <a
          className={`${btnGhost} inline-flex items-center gap-1.5 px-3 py-1 text-xs`}
          href={tutorial}
          target="_blank"
          rel="noreferrer"
        >
          <FiExternalLink className="size-3.5" /> 教學影片
        </a>
      </div>
    </div>
  );
}
