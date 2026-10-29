import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const json = (path) => JSON.parse(read(path));
const sortedEntries = (value) => Object.entries(value).sort(([a], [b]) => a.localeCompare(b));

const settings = json("agent/settings.json");
json("agent/web-search.json");
const manifest = json("agent/npm/package.json");
const lock = json("agent/npm/package-lock.json");

assert.equal(manifest.private, true, "The local extension manifest must stay private");
assert.deepEqual(manifest.allowScripts, { "@injaneity/pi-computer-use": true },
  "Approve only computer-use's helper setup, including future unpinned releases");
assert.match(read("agent/npm/.npmrc"), /^legacy-peer-deps=true\s*$/m);
assert.ok(Array.isArray(settings.packages), "settings.packages must be an array");
const names = settings.packages.map((source) => {
  assert.equal(typeof source, "string", "Default sources must be plain npm declarations");
  assert.match(source, /^npm:(?:@[^/@\s]+\/)?[^/@\s]+$/, "Default sources must be unpinned npm packages");
  return source.slice(4);
});
assert.equal(new Set(names).size, names.length, "Duplicate Pi package sources");
assert.ok(names.includes("@injaneity/pi-computer-use"), "Computer-use must be a default package");
assert.deepEqual([...names].sort(), Object.keys(manifest.dependencies).sort(),
  "Pi package sources and npm dependencies must match");
for (const [name, version] of Object.entries(manifest.dependencies)) {
  assert.equal(version, "*", `${name} must follow current releases`);
  const entry = lock.packages?.[`node_modules/${name}`];
  assert.ok(entry?.version && entry?.resolved && entry?.integrity,
    `${name} needs a complete snapshot lockfile entry`);
}
assert.equal(lock.lockfileVersion, 3);
assert.equal(lock.name, manifest.name);
assert.equal(lock.packages[""].name, manifest.name);
assert.deepEqual(sortedEntries(lock.packages[""].dependencies), sortedEntries(manifest.dependencies),
  "Lockfile root dependencies must match the npm manifest");
console.log(`Configuration OK: ${names.length} unpinned default packages; manifest and lockfile agree.`);
