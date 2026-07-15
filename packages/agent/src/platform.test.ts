import assert from "node:assert/strict";
import test from "node:test";
import { CreateInstanceSchema } from "@palserver/shared";
import type { InstanceRecord } from "./store.js";
import { serverConfigPlatformDir, serverPlatform } from "./platform.js";

function expectedPlatform(backend: InstanceRecord["backend"], agentPlatform: string): "windows" | "linux" {
  if (backend === "native") return agentPlatform === "win32" ? "windows" : "linux";
  return "linux";
}

test("serverPlatform: native reflects agent platform", () => {
  assert.equal(expectedPlatform("native", "win32"), "windows");
  assert.equal(expectedPlatform("native", "linux"), "linux");
  assert.equal(expectedPlatform("native", "darwin"), "linux");
});

test("serverPlatform: docker always linux", () => {
  assert.equal(expectedPlatform("docker", "win32"), "linux");
  assert.equal(expectedPlatform("docker", "linux"), "linux");
});

test("serverPlatform: k8s always linux", () => {
  assert.equal(expectedPlatform("k8s", "win32"), "linux");
  assert.equal(expectedPlatform("k8s", "linux"), "linux");
});

test("serverPlatform: Wine is a Windows game build on a Linux host", () => {
  const rec = { backend: "native", nativeRuntime: "wine" } as InstanceRecord;
  assert.equal(serverPlatform(rec), "windows");
  assert.equal(serverConfigPlatformDir(rec), "WindowsServer");
});

test("serverPlatform: Proton is a Windows game build on a Linux host", () => {
  const rec = { backend: "native", nativeRuntime: "proton" } as InstanceRecord;
  assert.equal(serverPlatform(rec), "windows");
  assert.equal(serverConfigPlatformDir(rec), "WindowsServer");
});

test("serverPlatform: missing nativeRuntime preserves legacy host behaviour", () => {
  const rec = { backend: "native" } as InstanceRecord;
  assert.equal(serverPlatform(rec), process.platform === "win32" ? "windows" : "linux");
});

test("CreateInstanceSchema: old payloads default to host runtime", () => {
  const input = CreateInstanceSchema.parse({ name: "legacy", settings: {} });
  assert.equal(input.nativeRuntime, "host");
});

test("CreateInstanceSchema: Proton headless defaults are safe", () => {
  const input = CreateInstanceSchema.parse({ name: "proton", nativeRuntime: "proton", settings: {} });
  assert.equal(input.protonUseWineD3d, true);
  assert.equal(input.protonUseXvfb, true);
});
