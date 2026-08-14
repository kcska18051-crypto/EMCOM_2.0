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

test("services page contains approved sidebar and cards", () => {
  assert.ok(existsSync(fileUrl("services/index.html")), "services/index.html is missing");

  const html = read("services/index.html");
  assert.match(html, /<h1[^>]*>Услуги<\/h1>/);
  assert.match(html, /<span>Услуги<\/span>/);
  assert.equal((html.match(/data-services-side-item/g) ?? []).length, 8);
  assert.equal((html.match(/data-services-card/g) ?? []).length, 8);
  for (const name of services) {
    assert.equal((html.match(new RegExp(name, "g")) ?? []).length, 2, `${name} must appear in sidebar and card`);
  }
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /<a[^>]*data-services-(?:side-item|card)/);
});

test("all completed headers link to services", () => {
  const pages = [
    "index.html",
    "company/index.html",
    "company/history/index.html",
    "company/partners/index.html",
    "company/licenses/index.html",
  ];

  for (const path of pages) {
    assert.match(read(path), /class="nav-link" href="(?:\.\.\/)*services\/">Услуги<\/a>/, `${path} has no services link`);
  }
});
