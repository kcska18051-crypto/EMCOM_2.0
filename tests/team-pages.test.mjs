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

test("team pages expose the approved responsive layouts", () => {
  const css = read("assets/css/prototype.css");

  assert.match(css, /\.team-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s);
  assert.match(css, /@media \(max-width:\s*1100px\)[\s\S]*\.team-grid\s*\{[^}]*repeat\(2,/s);
  assert.match(css, /@media \(max-width:\s*700px\)[\s\S]*\.team-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width:\s*700px\)[\s\S]*\.team-profile\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test("all completed headers link to the team page", () => {
  const headers = new Map([
    ["index.html", "company/staff/"],
    ["company/index.html", "staff/"],
    ["company/history/index.html", "../staff/"],
    ["company/partners/index.html", "../staff/"],
    ["company/licenses/index.html", "../staff/"],
    ["solutions/index.html", "../company/staff/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html", "../../company/staff/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html", "../../../company/staff/"],
    ["services/index.html", "../company/staff/"],
    ["services/predproektnoe-obsledovanie/index.html", "../../company/staff/"],
    ["cases/index.html", "../company/staff/"],
    ["cases/proekt-1/index.html", "../../company/staff/"],
    ["production/index.html", "../company/staff/"],
    ["knowledge/index.html", "../company/staff/"],
    ["knowledge/statya-1/index.html", "../../company/staff/"],
    ["contacts/index.html", "../company/staff/"]
  ]);

  for (const [path, href] of headers) {
    assert.ok(read(path).includes(`<a href="${href}">Команда</a>`), `${path} must link to ${href}`);
  }
});

test("all completed company pages expose the team subsection", () => {
  const pages = [
    "company/index.html",
    "company/history/index.html",
    "company/partners/index.html",
    "company/licenses/index.html"
  ];

  for (const path of pages) {
    const html = read(path);
    assert.ok((html.match(/>Команда<\/a>/g) ?? []).length >= 3, `${path} must expose team in header, mobile, and sidebar navigation`);
  }
});

test("company navigation places team immediately after company", () => {
  const expected = [
    "О компании",
    "Команда",
    "История компании",
    "Партнёры",
    "Сертификаты/лицензии",
    "Реквизиты"
  ];
  const expectedMobile = expected.slice(0, -1);
  const completedPages = [
    "index.html",
    "company/index.html",
    "company/history/index.html",
    "company/partners/index.html",
    "company/licenses/index.html",
    "company/staff/index.html",
    "company/staff/sotrudnik/index.html",
    "solutions/index.html",
    "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html",
    "solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html",
    "services/index.html",
    "services/predproektnoe-obsledovanie/index.html",
    "cases/index.html",
    "cases/proekt-1/index.html",
    "production/index.html",
    "knowledge/index.html",
    "knowledge/statya-1/index.html",
    "contacts/index.html"
  ];
  const companyPages = [
    "company/index.html",
    "company/history/index.html",
    "company/partners/index.html",
    "company/licenses/index.html",
    "company/staff/index.html",
    "company/staff/sotrudnik/index.html"
  ];
  const labels = (fragment) => [...fragment.matchAll(/<(?:a|span)\b[^>]*>([^<]+)<\/(?:a|span)>/g)]
    .map((match) => match[1].trim());

  for (const path of completedPages) {
    const menu = read(path).match(/<ul class="about-menu"[\s\S]*?<\/ul>/)?.[0] ?? "";
    assert.deepEqual(labels(menu), expected, `${path} header order`);
  }

  for (const path of companyPages) {
    const html = read(path);
    const subnav = html.match(/<nav class="company-mobile-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
    const sidebar = html.match(/<aside class="company-sidebar"[\s\S]*?<\/aside>/)?.[0] ?? "";
    assert.deepEqual(labels(subnav), expectedMobile, `${path} mobile subsection order`);
    assert.deepEqual(labels(sidebar), expected, `${path} sidebar order`);
  }
});
