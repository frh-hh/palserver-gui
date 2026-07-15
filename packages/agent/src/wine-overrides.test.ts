import assert from "node:assert/strict";
import test from "node:test";
import { mergeWineDllOverride } from "./native.js";

test("adds PalDefender's native d3d9 override", () => {
  assert.equal(mergeWineDllOverride(undefined, "d3d9", "n,b"), "d3d9=n,b");
});

test("preserves unrelated Wine DLL overrides", () => {
  assert.equal(
    mergeWineDllOverride("dwmapi=n,b;winhttp=n", "d3d9", "n,b"),
    "d3d9=n,b;dwmapi=n,b;winhttp=n",
  );
});

test("replaces an existing d3d9 override case-insensitively", () => {
  assert.equal(
    mergeWineDllOverride("D3D9=b;dwmapi=n,b", "d3d9", "n,b"),
    "d3d9=n,b;dwmapi=n,b",
  );
});
