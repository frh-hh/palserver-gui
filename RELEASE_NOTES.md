# palserver GUI — v2.2.6

更新/重灌失敗完整修復包(彙整 v2.2.4–v2.2.6):下載工具損毀自我修復、崩潰殘留程序自動清除(更新前+停止時)、失敗訊息直接顯示診斷輸出
Complete fix pack for failing updates/reinstalls (v2.2.4–v2.2.6 combined): downloader self-repair, automatic cleanup of crash-leftover processes (before updates & on stop), diagnostic output shown inline on failure
更新/再インストール失敗の完全修正パック(v2.2.4–v2.2.6 まとめ):ダウンローダー自動修復、クラッシュ残留プロセスの自動終了(更新前+停止時)、失敗時に診断出力を直接表示

> 有開自動更新會自己抓,或依下方手動下載。
> The in-app updater fetches it automatically, or download below.
> 自動更新で取得、または下記から手動でダウンロード。

<details>
<summary><b>🇹🇼 繁體中文</b></summary>

本版彙整 v2.2.3 之後的所有修復,針對「伺服器更新/重灌一直失敗」的完整處置:

### 修正
- **崩潰殘留程序鎖檔(最常見的真兇)** — 伺服器崩潰後,UE 的崩潰回報程式(CrashReportClient.exe)或殭屍 PalServer 會殘留在背景鎖住遊戲檔案(如 `dbghelp.dll`);GUI 顯示「已停止」,但更新一開檔就失敗(`0xE0434352`)、重灌刪檔 `EPERM`。現在**更新/重灌前**與**每次停止伺服器時**都會自動找出並結束這些殘留程序(記錄在日誌);若仍撞到鎖檔,錯誤訊息直接指引「結束 CrashReportClient 或重開機」。
- **下載工具損毀自我修復** — DepotDownloader 首次下載若不完整(斷線/磁碟滿/防毒攔截),損毀檔會被永久快取,之後每次安裝都敗在同一顆壞檔。現在下載加完整性檢查,偵測到「下載器啟動即崩潰」自動重置快取並重試。
- **安裝失敗直接顯示死因** — 失敗訊息附上下載器輸出的尾段(含例外堆疊摘要),不用再翻日誌檔。

### 安全邊界
- 自動清場只適用 GUI 自管的伺服器目錄;「採用既有安裝」的自訂目錄不會動(可能有你自己手動啟動的程序)。

### 建議
- 曾遇到更新失敗的島主:更新到本版後,直接再按一次「立即更新」即可,以上機制會自動處理。

</details>

<details>
<summary><b>🇨🇳 简体中文</b></summary>

本版汇整 v2.2.3 之后的所有修复,针对「服务器更新/重装一直失败」的完整处置:

### 修复
- **崩溃残留程序锁档(最常见的真凶)** — 服务器崩溃后,UE 的崩溃报告程序(CrashReportClient.exe)或僵尸 PalServer 会残留在后台锁住游戏档案(如 `dbghelp.dll`);GUI 显示「已停止」,但更新一开档就失败(`0xE0434352`)、重装删档 `EPERM`。现在**更新/重装前**与**每次停止服务器时**都会自动找出并结束这些残留程序(记录在日志);若仍撞到锁档,错误信息直接指引「结束 CrashReportClient 或重启电脑」。
- **下载工具损坏自我修复** — DepotDownloader 首次下载若不完整(断线/磁盘满/杀毒拦截),损坏档会被永久缓存,之后每次安装都败在同一颗坏档。现在下载加完整性检查,检测到「下载器启动即崩溃」自动重置缓存并重试。
- **安装失败直接显示死因** — 失败信息附上下载器输出的尾段(含异常堆栈摘要),不用再翻日志档。

### 安全边界
- 自动清场只适用 GUI 自管的服务器目录;「采用既有安装」的自定义目录不会动(可能有你自己手动启动的程序)。

### 建议
- 曾遇到更新失败的岛主:更新到本版后,直接再按一次「立即更新」即可,以上机制会自动处理。

</details>

<details>
<summary><b>🇬🇧 English</b></summary>

This release combines all fixes since v2.2.3 — the complete treatment for persistently failing server updates/reinstalls:

### Fixes
- **Crash-leftover processes locking files (the most common culprit)** — after a server crash, UE's crash reporter (CrashReportClient.exe) or a zombie PalServer lingers in the background holding locks on game files (e.g. `dbghelp.dll`); the GUI shows "stopped", but updates fail on file open (`0xE0434352`) and reinstalls hit `EPERM`. These leftovers are now automatically found and terminated **before every update/reinstall** and **on every server stop** (logged); if a lock is still hit, the error points straight to "end CrashReportClient or reboot".
- **Downloader self-repair** — if DepotDownloader's first download was incomplete (network drop / full disk / antivirus), the corrupted binary was cached forever and every install failed on it. Downloads now have integrity checks, and a crash-on-startup triggers an automatic cache reset + retry.
- **Install failures show the cause inline** — the error message includes the tail of the downloader output (with the exception summary); no more digging through log files.

### Safety boundary
- Automatic process cleanup only applies to GUI-managed server directories; adopted custom directories are never touched (they may contain processes you started yourself).

### Recommendation
- If updates kept failing for you: after updating to this version, just press "Update Now" once more — the mechanisms above handle the rest.

</details>

<details>
<summary><b>🇯🇵 日本語</b></summary>

本バージョンは v2.2.3 以降の修正をまとめた、「サーバー更新/再インストールが失敗し続ける」問題への完全対応版です:

### 修正
- **クラッシュ残留プロセスによるファイルロック(最多の真因)** — サーバークラッシュ後、UE のクラッシュレポーター(CrashReportClient.exe)やゾンビ PalServer がバックグラウンドに残り、ゲームファイル(`dbghelp.dll` など)をロックします。GUI は「停止中」と表示しますが、更新はファイルオープンで失敗(`0xE0434352`)、再インストールは `EPERM` に。**更新/再インストール前**と**サーバー停止のたび**に残留プロセスを自動検出・終了するようにしました(ログに記録)。それでもロックに当たる場合は「CrashReportClient を終了するか再起動」と明確に案内します。
- **ダウンローダーの自動修復** — DepotDownloader の初回取得が不完全だった場合(回線切断/ディスク満杯/ウイルス対策)、破損バイナリが恒久キャッシュされ以後のインストールがすべて失敗していました。取得時の整合性チェックを追加し、起動即クラッシュを検出したら自動でキャッシュをリセットして再試行します。
- **インストール失敗時に原因を直接表示** — エラーメッセージにダウンローダー出力の末尾(例外の要約含む)を添付。ログファイルを掘る必要はありません。

### 安全境界
- プロセスの自動終了は GUI 管理のサーバーディレクトリのみが対象。既存インストールを指定したカスタムディレクトリには触れません(ご自身で起動したプロセスがある可能性があるため)。

### おすすめ
- 更新失敗にお困りだった方:本バージョンへ更新後、もう一度「今すぐ更新」を押すだけで、上記の仕組みが自動対応します。

</details>
