import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");
const listingPath = "cases/index.html";
const detailPath = "cases/proekt-1/index.html";

test("cases listing and project detail files exist", () => {
  assert.ok(existsSync(fileUrl(listingPath)), `${listingPath} is missing`);
  assert.ok(existsSync(fileUrl(detailPath)), `${detailPath} is missing`);
});

test("cases listing contains three approved project cards", () => {
  const html = read(listingPath);
  assert.match(html, /<title>Кейсы — ЭМКОМ_2\.0<\/title>/);
  assert.match(html, /<h1>Кейсы<\/h1>/);
  assert.equal((html.match(/data-case-list-card/g) ?? []).length, 3);
  assert.equal((html.match(/<a class="cases-page-card" data-case-list-card/g) ?? []).length, 1);
  assert.match(html, /href="\.\/proekt-1\/"[\s\S]*<h2>Проект 1<\/h2>/);
  assert.ok(html.indexOf("Проект 1") < html.indexOf("Проект 2"));
  assert.ok(html.indexOf("Проект 2") < html.indexOf("Проект 3"));
});

test("project detail contains only the approved semantic blocks", () => {
  const html = read(detailPath);
  assert.match(html, /<title>Проект 1 — ЭМКОМ_2\.0<\/title>/);
  assert.match(html, /<h1>Проект 1<\/h1>/);
  assert.match(html, />Кейсы<\/a>[\s\S]*<span>Проект 1<\/span>/);
  assert.match(html, /data-case-hero/);
  assert.equal((html.match(/data-case-contact-control/g) ?? []).length, 2);
  assert.match(html, /aria-disabled="true">Заказать проект<\/span>/);
  assert.match(html, /aria-disabled="true">Задать вопрос<\/span>/);
  assert.equal((html.match(/data-case-feature(?=[\s>])/g) ?? []).length, 3);
  assert.equal((html.match(/data-case-feature-icon/g) ?? []).length, 3);
  assert.equal((html.match(/data-case-tab/g) ?? []).length, 4);
  assert.equal((html.match(/data-case-gallery-item/g) ?? []).length, 2);
  assert.equal((html.match(/data-case-service-card/g) ?? []).length, 2);
  assert.equal((html.match(/data-related-case-card/g) ?? []).length, 1);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /<form|feedback-form|id="feedback-title"/);
});

test("all completed headers link to cases", () => {
  const pages = [
    ["index.html", "cases/"],
    ["company/index.html", "../cases/"],
    ["company/history/index.html", "../../cases/"],
    ["company/partners/index.html", "../../cases/"],
    ["company/licenses/index.html", "../../cases/"],
    ["solutions/index.html", "../cases/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html", "../../cases/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html", "../../../cases/"],
    ["services/index.html", "../cases/"],
    ["services/predproektnoe-obsledovanie/index.html", "../../cases/"],
  ];
  for (const [path, href] of pages) {
    const html = read(path);
    assert.match(html, new RegExp(`class="nav-link" href="${href.replaceAll("/", "\\/")}">Кейсы<\\/a>`), `${path} has no cases link`);
  }
  assert.match(read(listingPath), /class="nav-link" href="\.\/" aria-current="page">Кейсы<\/a>/);
  assert.match(read(detailPath), /class="nav-link" href="\.\.\/" aria-current="page">Кейсы<\/a>/);
});

test("cases pages expose desktop, intermediate and mobile layouts", () => {
  const listing = read(listingPath);
  const detail = read(detailPath);
  const css = read("assets/css/prototype.css");
  assert.match(listing, /prototype\.css\?v=20260820-1/);
  assert.match(detail, /prototype\.css\?v=20260820-1/);
  assert.match(css, /\.cases-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 1200px\) and \(min-width: 901px\)[\s\S]*\.cases-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.cases-page-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.case-detail-tabs\s*\{[^}]*overflow-x:\s*auto/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.case-detail-gallery-grid[\s\S]*grid-template-columns:\s*1fr/s);
});
