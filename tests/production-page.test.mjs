import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("production page contains only the approved semantic blocks", () => {
  assert.ok(existsSync(new URL("../production/index.html", import.meta.url)));
  const html = read("production/index.html");

  assert.match(html, /<h1>Производство<\/h1>/);
  assert.match(html, /Главная[\s\S]*Производство/);
  assert.equal((html.match(/data-production-hero/g) ?? []).length, 1);
  assert.equal((html.match(/data-production-side-item/g) ?? []).length, 0);
  assert.equal((html.match(/data-production-inline-image/g) ?? []).length, 1);
  assert.equal((html.match(/data-production-calculation-control/g) ?? []).length, 1);
  assert.equal((html.match(/data-production-description/g) ?? []).length, 1);
  assert.match(html, /Получить предварительный расчёт/);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /<table\b/i);
  assert.doesNotMatch(html, /<aside\b/i);
  assert.doesNotMatch(html, /data-comparison-row/);

  const hero = html.indexOf("data-production-hero");
  const heading = html.indexOf("<h1>Производство</h1>");
  const layout = html.indexOf("production-content-layout");
  const firstText = html.indexOf("data-production-text-start");
  const inlineImage = html.indexOf("data-production-inline-image");
  const finalText = html.indexOf("data-production-text-end");
  const footer = html.indexOf("site-footer-placeholder");
  assert.ok(hero < heading && heading < layout && layout < footer);
  assert.ok(firstText < inlineImage && inlineImage < finalText);
});

test("production page exposes the approved responsive full-width article", () => {
  const html = read("production/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /class="service-detail-page production-page"/);
  assert.match(html, /class="production-content-layout"/);
  assert.match(html, /class="service-detail-content"/);
  assert.match(html, /prototype\.css\?v=20260820-2/);
  assert.match(css, /\.production-content-layout\s*\{[^}]*width:\s*min\(calc\(100% - 80px\), 1370px\)/s);
  assert.match(css, /\.production-inline-image\s*\{[^}]*aspect-ratio:\s*16 \/ 6/s);
  assert.match(css, /\.production-inline-image\.media-placeholder\s*\{[^}]*min-height:\s*0/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.production-content-layout\s*\{[^}]*width:\s*min\(calc\(100% - 48px\), 1370px\)/s);
});

test("all completed headers link to production", () => {
  const headers = new Map([
    ["index.html", "production/"],
    ["company/index.html", "../production/"],
    ["company/history/index.html", "../../production/"],
    ["company/partners/index.html", "../../production/"],
    ["company/licenses/index.html", "../../production/"],
    ["solutions/index.html", "../production/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html", "../../production/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html", "../../../production/"],
    ["services/index.html", "../production/"],
    ["services/predproektnoe-obsledovanie/index.html", "../../production/"],
    ["cases/index.html", "../production/"],
    ["cases/proekt-1/index.html", "../../production/"]
  ]);

  for (const [path, href] of headers) {
    const html = read(path);
    assert.ok(html.includes(`href="${href}">Производство</a>`), `${path} must link to ${href}`);
  }
});

test("production navigation is active only on its page", () => {
  const html = read("production/index.html");
  assert.match(html, /href="\.\/" aria-current="page">Производство<\/a>/);
  assert.match(html, /<script type="module" src="\.\.\/assets\/js\/header\.js\?v=20260820-2"><\/script>/);
});
