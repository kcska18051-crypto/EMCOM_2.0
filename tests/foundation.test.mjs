import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("foundation files exist", () => {
  assert.equal(existsSync(new URL("../index.html", import.meta.url)), true);
  assert.equal(existsSync(new URL("../assets/css/prototype.css", import.meta.url)), true);
  assert.equal(existsSync(new URL("../.nojekyll", import.meta.url)), true);
});

test("index is a Russian semantic homepage", () => {
  const html = read("index.html");
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<title>ЭМКОМ_2\.0 — прототип<\/title>/);
  assert.match(html, /href="assets\/css\/prototype\.css\?v=20260814-16"/);
  assert.match(html, /<main[^>]*class="homepage"/);
  assert.doesNotMatch(html, /Страницы будут добавлены после согласования/);
});

test("shared stylesheet exposes approved wireframe primitives", () => {
  const css = read("assets/css/prototype.css");
  for (const selector of [
    ".site-shell",
    ".homepage",
    ".hero",
    ".features",
    ".wireframe-block",
    ".media-placeholder",
  ]) {
    assert.equal(css.includes(selector), true, `missing ${selector}`);
  }
});

test("package declares ES module semantics", () => {
  const packageJson = JSON.parse(read("package.json"));
  assert.equal(packageJson.type, "module");
});
