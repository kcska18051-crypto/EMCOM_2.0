import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("foundation files exist", () => {
  assert.equal(existsSync(new URL("../index.html", import.meta.url)), true);
  assert.equal(existsSync(new URL("../assets/css/prototype.css", import.meta.url)), true);
  assert.equal(existsSync(new URL("../.nojekyll", import.meta.url)), true);
});

test("index is a Russian semantic page with an empty registry", () => {
  const html = read("index.html");
  assert.match(html, /<html lang="ru">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1">/);
  assert.match(html, /<title>ЭМКОМ_2\.0 — прототип<\/title>/);
  assert.match(html, /href="assets\/css\/prototype\.css"/);
  assert.match(html, /<main[^>]*class="page-registry"/);
  assert.match(html, /Страницы будут добавлены после согласования/);
});

test("shared stylesheet exposes approved wireframe primitives", () => {
  const css = read("assets/css/prototype.css");
  for (const selector of [
    ".site-shell",
    ".page-registry",
    ".empty-state",
    ".wireframe-block",
    ".media-placeholder",
  ]) {
    assert.equal(css.includes(selector), true, `missing ${selector}`);
  }
});
