import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");

const listingPath = "solutions/index.html";
const groupPath = "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html";
const detailPath = "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html";

test("solutions hierarchy files exist", () => {
  assert.ok(existsSync(fileUrl(listingPath)), `${listingPath} is missing`);
  assert.ok(existsSync(fileUrl(groupPath)), `${groupPath} is missing`);
  assert.ok(existsSync(fileUrl(detailPath)), `${detailPath} is missing`);
});

test("solutions listing is the renamed eight-card first level", () => {
  const html = read(listingPath);
  assert.match(html, /<title>Решения — ЭМКОМ_2\.0<\/title>/);
  assert.match(html, /<h1>Решения<\/h1>/);
  assert.match(html, /<span>Решения<\/span>/);
  assert.equal((html.match(/data-solution-card/g) ?? []).length, 8);
  assert.match(html, /<a class="services-page-card" data-solution-card href="\.\/avtonomnoe-i-rezervnoe-elektrosnabzhenie\/">[\s\S]*Автономное и резервное электроснабжение[\s\S]*<\/a>/);
  assert.match(html, /class="nav-link" href="\.\/" aria-current="page">Решения<\/a>/);
});

test("autonomous power page is the three-card second level", () => {
  const html = read(groupPath);
  assert.match(html, /<h1>Автономное и резервное электроснабжение<\/h1>/);
  assert.match(html, /<a href="\.\.\/">Решения<\/a>/);
  assert.equal((html.match(/data-solution-child-card/g) ?? []).length, 3);
  for (const title of ["Дизельные электростанции", "Газопоршневые установки", "Газотурбинные установки"]) {
    assert.match(html, new RegExp(`<h2>${title}</h2>`));
  }
  assert.match(html, /href="\.\/dizelnye-elektrostantsii\/"/);
  assert.match(html, /class="solution-level-group is-open"/);
  assert.equal((html.match(/data-solution-collapsed/g) ?? []).length, 7);
});

test("diesel page reuses the approved detail content with four breadcrumbs", () => {
  const html = read(detailPath);
  assert.match(html, /<title>Дизельные электростанции — ЭМКОМ_2\.0<\/title>/);
  assert.match(html, /<h1>Дизельные электростанции<\/h1>/);
  assert.match(html, />Решения<\/a>[\s\S]*>Автономное и резервное электроснабжение<\/a>[\s\S]*<span>Дизельные электростанции<\/span>/);
  assert.match(html, /data-service-detail-description/);
  assert.match(html, /data-service-detail-capabilities/);
  assert.equal((html.match(/data-comparison-row/g) ?? []).length, 3);
  assert.match(html, /<h2>Дополнительно<\/h2>/);
  assert.match(html, /class="nav-link" href="\.\.\/\.\.\/" aria-current="page">Решения<\/a>/);
});

test("old services URLs redirect to the new solution levels", () => {
  const listingRedirect = read("services/index.html");
  const groupRedirect = read("services/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html");
  assert.match(listingRedirect, /http-equiv="refresh" content="0; url=\.\.\/solutions\/"/);
  assert.match(groupRedirect, /http-equiv="refresh" content="0; url=\.\.\/\.\.\/solutions\/avtonomnoe-i-rezervnoe-elektrosnabzhenie\/"/);
});

test("completed page headers link to solutions and leave services inactive", () => {
  const pages = [
    ["index.html", "solutions/"],
    ["company/index.html", "../solutions/"],
    ["company/history/index.html", "../../solutions/"],
    ["company/partners/index.html", "../../solutions/"],
    ["company/licenses/index.html", "../../solutions/"],
  ];
  for (const [path, href] of pages) {
    const html = read(path);
    assert.match(html, new RegExp(`class="nav-link" href="${href.replaceAll("/", "\\/")}">Решения<\\/a>`), `${path} has no solutions link`);
    assert.match(html, /class="nav-link" href="#">Услуги<\/a>/, `${path} services link is not inactive`);
  }
});

test("second level follows approved desktop and mobile grids", () => {
  const html = read(groupPath);
  const css = read("assets/css/prototype.css");
  assert.match(html, /prototype\.css\?v=20260817-3/);
  assert.match(css, /\.solution-level-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.solution-level-sidebar\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.solution-level-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.solution-level-page \.company-heading h1\s*\{[^}]*font-size:\s*clamp\(30px, 8vw, 34px\)/s);
});
