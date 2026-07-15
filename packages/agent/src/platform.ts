import type { InstanceRecord } from "./store.js";

/**
 * Platform detection that distinguishes the *agent's* OS from the *game
 * server's* OS. PalDefender availability depends on where the server process
 * runs, not where the agent runs. For docker/k8s the server always runs
 * inside a Linux container.
 */

/** The OS the game server process runs on, not the agent's OS. */
export function serverPlatform(rec: InstanceRecord): "windows" | "linux" {
  if (rec.backend === "native") {
    if (rec.nativeRuntime === "wine" || rec.nativeRuntime === "proton") return "windows";
    return process.platform === "win32" ? "windows" : "linux";
  }
  return "linux";
}

/** Config directory used by the game build, independent of the agent OS. */
export function serverConfigPlatformDir(rec: InstanceRecord): "WindowsServer" | "LinuxServer" {
  return serverPlatform(rec) === "windows" ? "WindowsServer" : "LinuxServer";
}

export function isWineRuntime(rec: InstanceRecord): boolean {
  return rec.backend === "native" && rec.nativeRuntime === "wine";
}

export function isProtonRuntime(rec: InstanceRecord): boolean {
  return rec.backend === "native" && rec.nativeRuntime === "proton";
}

export function isWindowsCompatRuntime(rec: InstanceRecord): boolean {
  return isWineRuntime(rec) || isProtonRuntime(rec);
}
