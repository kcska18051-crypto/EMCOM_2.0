import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");
const detailPath = "services/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html";

test("first service card links to the detail page", () => {
  const html = read("services/index.html");
  assert.match(html, /<a class="services-page-card" data-services-card href="\.\/avtonomnoe-i-rezervnoe-elektrosnabzhenie\/">[\s\S]*Автономное и резервное электроснабжение[\s\S]*<\/a>/);
});

test("service detail contains only approved semantic sections", () => {
  assert.ok(existsSync(fileUrl(detailPath)), `${detailPath} is missing`);
  const html = read(detailPath);

  assert.match(html, /<h1>Автономное и резервное электроснабжение<\/h1>/);
  assert.match(html, /data-service-detail-hero/);
  assert.equal((html.match(/data-services-side-item/g) ?? []).length, 8);
  assert.match(html, /data-service-detail-description/);
  assert.match(html, /data-service-detail-capabilities/);
  assert.equal((html.match(/data-comparison-row/g) ?? []).length, 3);
  assert.match(html, /<h2>Дополнительно<\/h2>/);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, />\s*(Видео|Отзывы|Новости|Фотогалерея|Проекты|Статьи|Документы|Сотрудники|Вопрос\/ответ|Товары|Оставьте заявку)\s*</);
});

test("service detail has approved responsive rules", () => {
  const html = read(detailPath);
  const css = read("assets/css/prototype.css");

  assert.match(html, /prototype\.css\?v=20260814-19/);
  assert.match(css, /\.service-detail-layout\s*\{[^}]*grid-template-columns:\s*260px minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.service-detail-sidebar\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.comparison-row\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
