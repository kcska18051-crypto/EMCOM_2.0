import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");
const listingPath = "services/index.html";
const detailPath = "services/predproektnoe-obsledovanie/index.html";

const serviceTitles = [
  "Предпроектное обследование",
  "Проектирование",
  "Строительно-монтажные работы",
  "Пусконаладочные работы",
  "Сервис",
];

test("services listing and detail files exist", () => {
  assert.ok(existsSync(fileUrl(listingPath)), `${listingPath} is missing`);
  assert.ok(existsSync(fileUrl(detailPath)), `${detailPath} is missing`);
});

test("services listing contains the approved five-item structure", () => {
  const html = read(listingPath);

  assert.match(html, /<title>Услуги — ЭМКОМ_2\.0<\/title>/);
  assert.match(html, /<h1>Услуги<\/h1>/);
  assert.match(html, /<span>Услуги<\/span>/);
  assert.equal((html.match(/data-services-side-item/g) ?? []).length, 5);
  assert.equal((html.match(/data-service-card/g) ?? []).length, 5);
  assert.equal((html.match(/<a class="services-page-card" data-service-card/g) ?? []).length, 1);
  assert.match(html, /<a class="services-page-card" data-service-card href="\.\/predproektnoe-obsledovanie\/">[\s\S]*Предпроектное обследование[\s\S]*<\/a>/);

  let previousIndex = -1;
  for (const title of serviceTitles) {
    const currentIndex = html.indexOf(`<h2>${title}</h2>`);
    assert.ok(currentIndex > previousIndex, `${title} is missing or out of order`);
    previousIndex = currentIndex;
  }
});

test("pre-project survey detail matches the approved semantic page", () => {
  const html = read(detailPath);

  assert.match(html, /<title>Предпроектное обследование — ЭМКОМ_2\.0<\/title>/);
  assert.match(html, /<h1>Предпроектное обследование<\/h1>/);
  assert.match(html, />Услуги<\/a>[\s\S]*<span>Предпроектное обследование<\/span>/);
  assert.equal((html.match(/data-services-side-item/g) ?? []).length, 5);
  assert.match(html, /data-service-detail-description/);
  assert.match(html, /data-service-detail-capabilities/);
  assert.equal((html.match(/data-comparison-row/g) ?? []).length, 3);
  assert.match(html, /<h2>Дополнительно<\/h2>/);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.equal((html.match(/Получить предварительный расчёт/g) ?? []).length, 1);
  assert.match(html, /<span class="service-detail-calculation-control" aria-disabled="true">Получить предварительный расчёт<\/span>/);
  assert.doesNotMatch(html, /<form|feedback-form|id="feedback-title"/);
});

test("completed headers link to services with the right relative path", () => {
  const pages = [
    ["index.html", "services/"],
    ["company/index.html", "../services/"],
    ["company/history/index.html", "../../services/"],
    ["company/partners/index.html", "../../services/"],
    ["company/licenses/index.html", "../../services/"],
    ["solutions/index.html", "../services/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html", "../../services/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html", "../../../services/"],
  ];

  for (const [path, href] of pages) {
    const html = read(path);
    assert.match(html, new RegExp(`class="nav-link" href="${href.replaceAll("/", "\\/")}">Услуги<\\/a>`), `${path} has no services link`);
  }

  for (const path of [listingPath, detailPath]) {
    const html = read(path);
    assert.match(html, /class="nav-link" href="(?:\.\/|\.\.\/)" aria-current="page">Услуги<\/a>/);
  }
});

test("services pages reuse the approved responsive rules", () => {
  const listing = read(listingPath);
  const detail = read(detailPath);
  const css = read("assets/css/prototype.css");

  assert.match(listing, /prototype\.css\?v=20260817-12/);
  assert.match(detail, /prototype\.css\?v=20260817-12/);
  assert.match(css, /\.services-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.services-page-sidebar\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.services-page-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.service-detail-calculation-control\s*\{[^}]*width:\s*100%/s);
});
