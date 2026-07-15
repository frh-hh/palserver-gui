import assert from "node:assert/strict";
import test from "node:test";
import { parseInstalledDepotsAcf } from "./version.js";

test("parses SteamCMD InstalledDepots manifests", () => {
  const acf = `"AppState"
{
  "buildid" "24088465"
  "InstalledDepots"
  {
    "1004"
    {
      "manifest" "5612541580377302256"
      "size" "64647928"
    }
    "2394011"
    {
      "manifest" "4441848255153707890"
      "size" "5983197732"
    }
  }
}`;

  assert.deepEqual(parseInstalledDepotsAcf(acf), {
    "1004": "5612541580377302256",
    "2394011": "4441848255153707890",
  });
});

test("ignores manifest fields outside InstalledDepots", () => {
  assert.deepEqual(parseInstalledDepotsAcf(`"manifest" "999"\n"Other"\n{\n}`), {});
});
