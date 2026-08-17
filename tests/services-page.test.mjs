import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");

const services = [
  "Автономное и резервное электроснабжение",
  "Трансформация и распределение электроэнергии",
  "Теплоснабжение",
  "Водоподготовка и очистка стоков",
  "Насосные и компрессорные станции",
  "Модульные ЦОД и аппаратные",
  "Проектирование и строительство",
  "Нестандартное модульное решение",
];

test("solutions page contains approved sidebar and cards", () => {
  assert.ok(existsSync(fileUrl("solutions/index.html")), "solutions/index.html is missing");

  const html = read("solutions/index.html");
  assert.match(html, /<h1[^>]*>Решения<\/h1>/);
  assert.match(html, /<span>Решения<\/span>/);
  assert.equal((html.match(/data-services-side-item/g) ?? []).length, 8);
  assert.equal((html.match(/data-solution-card/g) ?? []).length, 8);
  for (const name of services) {
    assert.equal((html.match(new RegExp(name, "g")) ?? []).length, 2, `${name} must appear in sidebar and card`);
  }
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.equal((html.match(/<a class="services-page-card" data-solution-card/g) ?? []).length, 1);
  assert.doesNotMatch(html, /<a(?:\s|>)[^>]*data-services-side-item/);
});

test("all completed headers link to solutions", () => {
  const pages = [
    "index.html",
    "company/index.html",
    "company/history/index.html",
    "company/partners/index.html",
    "company/licenses/index.html",
  ];

  for (const path of pages) {
    assert.match(read(path), /class="nav-link" href="(?:\.\.\/)*solutions\/">Решения<\/a>/, `${path} has no solutions link`);
  }
});

test("solutions page follows approved responsive grid", () => {
  const html = read("solutions/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /prototype\.css\?v=20260817-9/);
  assert.match(css, /\.services-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 1200px\) and \(min-width: 901px\)[\s\S]*\.services-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.services-page-sidebar\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.services-page-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.services-page-card\s*\{[^}]*min-height:\s*280px/s);
});
