import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");

test("company page follows the approved Aspro content structure", () => {
  assert.ok(existsSync(fileUrl("company/index.html")), "company/index.html is missing");

  const html = read("company/index.html");
  assert.match(html, /<h1[^>]*>О компании<\/h1>/);
  assert.match(html, /aria-label="Хлебные крошки"/);
  assert.equal((html.match(/data-company-side-item/g) ?? []).length, 5);
  assert.match(html, /class="company-media media-placeholder"/);
  assert.match(html, /<h2>Lorem ipsum dolor sit amet<\/h2>/);
  assert.match(html, /<h2>Aenean vulputate eleifend tellus<\/h2>/);
  assert.doesNotMatch(html, /Чем мы можем быть вам полезны|Что уже сделано/);
  assert.doesNotMatch(html, /sidebar-promo|company-sidebar-banner/);
});

test("company page reuses the shared responsive shell", () => {
  assert.ok(existsSync(fileUrl("company/index.html")), "company/index.html is missing");

  const html = read("company/index.html");
  const css = read("assets/css/prototype.css");
  assert.match(html, /href="\.\.\/assets\/css\/prototype\.css\?v=20260817-11"/);
  assert.match(html, /src="\.\.\/assets\/images\/emcom-logo\.png"/);
  assert.match(html, /src="\.\.\/assets\/js\/header\.js\?v=20260814-3"/);
  assert.match(css, /\.company-layout\s*\{[^}]*grid-template-columns:\s*280px minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.company-sidebar\s*\{[^}]*display:\s*none/s);
});

test("company page exposes completed subsections on mobile", () => {
  const html = read("company/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /<nav class="company-mobile-nav" aria-label="Подразделы компании">/);
  assert.match(html, /<a href="\.\/" aria-current="page">О компании<\/a>/);
  assert.match(html, /<a href="history\/">История компании<\/a>/);
  assert.match(html, /<a href="partners\/">Партнёры<\/a>/);
  assert.doesNotMatch(html, /company-mobile-switch/);
  assert.match(css, /\.company-mobile-nav\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.company-mobile-nav\s*\{[^}]*display:\s*flex/s);
});
