# Linux agent 管理 Wine PalServer

這個模式讓 Linux 上的 agent 管理 **Windows 版** Palworld Dedicated Server。
適合需要 Windows 專用模組、但主機系統是 Linux 的部署。

> Palworld 1.0 的 Windows 服務端在部分 Wine 版本下可能無法完成原子存檔。
> 對無桌面的正式伺服器優先選擇 Proton runtime；普通 Wine 模式保留給既有環境。

## Proton（推薦）

建立原生實例時選擇「Windows 版 + Proton」，並填寫 Proton 頂層啟動腳本，例如：

```text
/opt/palworld-windows/tools/GE-Proton11-1/proton
```

agent 會為每個實例建立獨立的 `STEAM_COMPAT_DATA_PATH`，透過 `proton run`
啟動 Windows PalServer。無 GPU 的伺服器預設啟用 `PROTON_USE_WINED3D=1` 和
`xvfb-run`。偵測到 PalDefender 或 UE4SS 時會分別加入 `d3d9=n,b` 與
`dwmapi=n,b`，不需修改全域 Wine 登錄檔。

## 建議架構

- `palserver-agent` 與 Wine/PalServer 安裝在同一台 Linux 主機。
- Web 面板可以由 agent 一併提供，也可以獨立部署在其他機器。
- 遠端管理請透過 Tailscale/WireGuard 或 HTTPS 反向代理，不要直接公開 agent 的 8250 埠。

## 建立實例

1. 先在 Linux 主機安裝可用的 64-bit Wine，確認 `wine64 --version` 或 `wine --version` 能執行。
2. 在「建立伺服器」選擇「原生」，再選「Windows 版 + Wine」。
3. `Wine 執行檔` 留空會依序尋找 `wine64`、`wine`；使用自訂 Wine 時可填完整路徑。
4. 已有 Wine prefix 可在 `WINEPREFIX` 填絕對路徑；留空會在該實例資料夾建立獨立 prefix。
5. 伺服器路徑可指向含 `PalServer.exe` 的既有 Windows 版安裝；空目錄或新路徑會自動下載 Windows depot。
6. 無桌面的主機保留「使用 xvfb-run」；關閉此選項才會直接執行 Wine。

每個實例應使用不同的 Wine prefix。agent 會拒絕兩個實例明確指定相同 prefix，避免停止一台時影響另一台。

## agent 管理的差異

Wine 實例會自動：

- 驗證 `PalServer.exe`，而不是 `PalServer.sh`；
- 下載/更新 Windows 版 depot；
- 讀寫 `Pal/Saved/Config/WindowsServer`；
- 透過 Wine 啟動 `Pal/Binaries/Win64/PalServer-Win64-Shipping-Cmd.exe`；
- 優先透過 REST 正常存檔關機，失敗時只終止該實例的 Wine prefix；
- 按 Windows 服務端版面偵測 UE4SS、PalDefender 與其他 Win64 模組。

Wine 與 DLL 模組的實際相容性仍取決於 Wine、Palworld 和模組版本。更新前請保留世界備份。

## 既有實例相容性

`nativeRuntime` 是可選的新增欄位。舊的 `instances.json` 沒有此欄位時等同 `host`，仍維持原本 Windows 跑 Windows 版、Linux 跑 Linux 版的行為，不需要手動遷移。
