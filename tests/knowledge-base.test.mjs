import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const url = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => (existsSync(url(path)) ? readFileSync(url(path), "utf8") : "");

test("knowledge listing and article detail files exist", () => {
  assert.ok(existsSync(url("knowledge/index.html")));
  assert.ok(existsSync(url("knowledge/statya-1/index.html")));
});

test("knowledge list contains nine minimal cards and one link", () => {
  const html = read("knowledge/index.html");

  assert.match(html, /<h1>База знаний<\/h1>/);
  assert.match(html, /Главная[\s\S]*База знаний/);
  assert.equal((html.match(/data-knowledge-card(?:\s|>)/g) ?? []).length, 9);
  assert.equal((html.match(/data-knowledge-card-link/g) ?? []).length, 1);
  assert.equal((html.match(/data-knowledge-category/g) ?? []).length, 5);
  for (let index = 1; index <= 9; index += 1) {
    assert.match(html, new RegExp(`Статья ${index}`));
  }
  assert.match(html, /href="statya-1\/"[^>]*data-knowledge-card-link/);
  assert.doesNotMatch(html, /data-year-filter|data-tag-cloud|<time\b|Дата|Рубрика/i);
});

test("knowledge detail keeps only the approved article blocks", () => {
  const html = read("knowledge/statya-1/index.html");

  assert.match(html, /data-knowledge-detail/);
  assert.equal((html.match(/data-knowledge-hero/g) ?? []).length, 1);
  assert.match(html, /<h1>Статья 1<\/h1>/);
  assert.match(html, /Главная[\s\S]*href="\.\.\/"[\s\S]*База знаний[\s\S]*Статья 1/);
  assert.equal((html.match(/data-knowledge-category/g) ?? []).length, 5);
  assert.match(html, /data-knowledge-article/);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /<form\b|data-gallery|data-related|data-tag-cloud|<time\b/i);
});

test("all completed headers link to knowledge base", () => {
  const headers = new Map([
    ["index.html", "knowledge/"],
    ["company/index.html", "../knowledge/"],
    ["company/history/index.html", "../../knowledge/"],
    ["company/partners/index.html", "../../knowledge/"],
    ["company/licenses/index.html", "../../knowledge/"],
    ["solutions/index.html", "../knowledge/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html", "../../knowledge/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html", "../../../knowledge/"],
    ["services/index.html", "../knowledge/"],
    ["services/predproektnoe-obsledovanie/index.html", "../../knowledge/"],
    ["cases/index.html", "../knowledge/"],
    ["cases/proekt-1/index.html", "../../knowledge/"],
    ["production/index.html", "../knowledge/"]
  ]);

  for (const [path, href] of headers) {
    assert.ok(read(path).includes(`href="${href}">База знаний</a>`), `${path} must link to ${href}`);
  }
});

test("knowledge pages expose active navigation and responsive layouts", () => {
  const list = read("knowledge/index.html");
  const detail = read("knowledge/statya-1/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(list, /href="\.\/" aria-current="page">База знаний<\/a>/);
  assert.match(detail, /href="\.\.\/" aria-current="page">База знаний<\/a>/);
  assert.match(list, /prototype\.css\?v=20260817-8/);
  assert.match(detail, /prototype\.css\?v=20260817-8/);
  assert.match(css, /\.knowledge-layout\s*\{[^}]*grid-template-columns:\s*280px minmax\(0, 1fr\)/s);
  assert.match(css, /\.knowledge-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width:\s*1200px\)[\s\S]*\.knowledge-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.knowledge-layout\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.knowledge-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
