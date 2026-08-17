import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");
const detailPath = "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html";

test("diesel card links to the detail page", () => {
  const html = read("solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html");
  assert.match(html, /<a class="solution-level-card" data-solution-child-card href="\.\/dizelnye-elektrostantsii\/">[\s\S]*Дизельные электростанции[\s\S]*<\/a>/);
});

test("service detail contains only approved semantic sections", () => {
  assert.ok(existsSync(fileUrl(detailPath)), `${detailPath} is missing`);
  const html = read(detailPath);

  assert.match(html, /<h1>Дизельные электростанции<\/h1>/);
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

  assert.match(html, /prototype\.css\?v=20260817-8/);
  assert.match(css, /\.service-detail-layout\s*\{[^}]*grid-template-columns:\s*260px minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.service-detail-sidebar\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.comparison-row\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test("service detail shows one non-interactive calculation control", () => {
  const html = read(detailPath);
  const css = read("assets/css/prototype.css");
  const label = "Получить предварительный расчёт";

  assert.equal((html.match(new RegExp(label, "g")) ?? []).length, 1);
  assert.match(
    html,
    /<span class="service-detail-calculation-control" aria-disabled="true">Получить предварительный расчёт<\/span>/,
  );
  assert.doesNotMatch(html, new RegExp(`<(?:a|button)[^>]*>${label}<\\/(?:a|button)>`));
  assert.match(css, /\.service-detail-action\s*\{[^}]*display:\s*flex;[^}]*justify-content:\s*flex-end;/s);
  assert.match(css, /\.service-detail-calculation-control\s*\{[^}]*background:\s*#343434;[^}]*color:\s*#fff;/s);
  assert.match(
    css,
    /@media \(max-width: 900px\)[\s\S]*\.service-detail-calculation-control\s*\{[^}]*width:\s*100%;/s,
  );
});
