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
  assert.equal((html.match(/data-production-side-item/g) ?? []).length, 5);
  assert.equal((html.match(/data-production-calculation-control/g) ?? []).length, 1);
  assert.equal((html.match(/data-production-description/g) ?? []).length, 1);
  assert.match(html, /Получить предварительный расчёт/);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /<table\b/i);
  assert.doesNotMatch(html, /data-comparison-row/);

  const hero = html.indexOf("data-production-hero");
  const heading = html.indexOf("<h1>Производство</h1>");
  const layout = html.indexOf("service-detail-layout");
  const footer = html.indexOf("site-footer-placeholder");
  assert.ok(hero < heading && heading < layout && layout < footer);
});

test("production page reuses the approved responsive service detail shell", () => {
  const html = read("production/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /class="service-detail-page production-page"/);
  assert.match(html, /class="services-page-sidebar service-detail-sidebar"/);
  assert.match(html, /class="service-detail-content"/);
  assert.match(html, /prototype\.css\?v=20260817-5/);
  assert.match(css, /\.service-detail-layout\s*\{[^}]*grid-template-columns:\s*260px minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.service-detail-layout\s*\{[^}]*display:\s*block/s);
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
  assert.match(html, /<script type="module" src="\.\.\/assets\/js\/header\.js\?v=20260814-3"><\/script>/);
});
