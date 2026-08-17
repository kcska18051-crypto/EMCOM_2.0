import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const url = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => (existsSync(url(path)) ? readFileSync(url(path), "utf8") : "");

test("team listing and one employee detail page exist", () => {
  assert.ok(existsSync(url("company/staff/index.html")));
  assert.ok(existsSync(url("company/staff/sotrudnik/index.html")));
});

test("team listing contains six anonymous cards and one detail link", () => {
  const html = read("company/staff/index.html");

  assert.match(html, /<h1>Команда<\/h1>/);
  assert.equal((html.match(/data-team-card/g) ?? []).length, 6);
  assert.equal((html.match(/Фамилия имя отчество/g) ?? []).length, 6);
  assert.equal((html.match(/>Должность</g) ?? []).length, 6);
  assert.equal((html.match(/data-team-detail-link/g) ?? []).length, 1);
  assert.match(html, /href="sotrudnik\/"[^>]*data-team-detail-link/);
});

test("employee detail contains only the approved profile content", () => {
  const html = read("company/staff/sotrudnik/index.html");
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";

  assert.match(main, /<h1>Фамилия имя отчество<\/h1>/);
  assert.match(main, /\+7 \(000\) 000-00-00/);
  assert.match(main, /name@company\.ru/);
  assert.equal((main.match(/<p\b/g) ?? []).length, 2);
  assert.doesNotMatch(main, /Услуги|Проекты|Отзывы|Социальные сети|Написать сообщение|<form\b/i);
  assert.doesNotMatch(main, /href="(?:tel:|mailto:)/i);
});
