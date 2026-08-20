import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const url = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => (existsSync(url(path)) ? readFileSync(url(path), "utf8") : "");

test("contacts page contains the approved two offices", () => {
  assert.ok(existsSync(url("contacts/index.html")));
  const html = read("contacts/index.html");

  assert.match(html, /<h1>Контакты<\/h1>/);
  assert.match(html, /Главная[\s\S]*Контакты/);
  assert.equal((html.match(/data-contacts-map/g) ?? []).length, 1);
  assert.equal((html.match(/data-contact-office(?:\s|>)/g) ?? []).length, 2);
  assert.equal((html.match(/data-contact-office-media/g) ?? []).length, 2);
  assert.match(html, /Санкт-Петербург/);
  assert.match(html, /Кировск/);
  assert.ok(html.indexOf("data-contacts-map") < html.indexOf("Санкт-Петербург"));
  assert.ok(html.indexOf("Санкт-Петербург") < html.indexOf("Кировск"));
});

test("contacts follow the Aspro map-side-below composition", () => {
  const html = read("contacts/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /class="contact-office contact-office--side"[^>]*data-contact-office/);
  assert.match(html, /class="contact-office contact-office--below"[^>]*data-contact-office/);
  assert.match(css, /\.contacts-layout\s*\{[^}]*grid-template-areas:\s*"map side"\s*"below side"/s);
  assert.match(css, /\.contact-office--below\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(220px, 0\.72fr\) minmax\(0, 1\.28fr\)/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.contacts-layout\s*\{[^}]*grid-template-areas:\s*"map"\s*"side"\s*"below"/s);
});

test("contacts page uses the exact approved contact data", () => {
  const html = read("contacts/index.html");

  assert.match(html, /г\. Санкт-Петербург, ул\. Бабушкина, д\. 123, лит\. ЕБ/);
  assert.match(html, /Ленинградская область, г\. Кировск, ул\. Железнодорожная, д\. 2/);
  assert.equal((html.match(/Пн\. – Пт\.: с 8:00 до 17:00/g) ?? []).length, 2);
  assert.equal((html.match(/\+7 \(812\) 389-41-14/g) ?? []).length, 2);
  assert.equal((html.match(/sale@emkom\.spb\.ru/g) ?? []).length, 2);
});

test("contacts content is a non-interactive prototype", () => {
  const html = read("contacts/index.html");
  const main = html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";

  assert.doesNotMatch(main, /<form\b|<button\b|href="(?:tel:|mailto:)/i);
  assert.doesNotMatch(html, /data-contact-office-3|Региональные представительства/);
});

test("all completed headers link to contacts", () => {
  const headers = new Map([
    ["index.html", "contacts/"],
    ["company/index.html", "../contacts/"],
    ["company/history/index.html", "../../contacts/"],
    ["company/partners/index.html", "../../contacts/"],
    ["company/licenses/index.html", "../../contacts/"],
    ["solutions/index.html", "../contacts/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html", "../../contacts/"],
    ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html", "../../../contacts/"],
    ["services/index.html", "../contacts/"],
    ["services/predproektnoe-obsledovanie/index.html", "../../contacts/"],
    ["cases/index.html", "../contacts/"],
    ["cases/proekt-1/index.html", "../../contacts/"],
    ["production/index.html", "../contacts/"],
    ["knowledge/index.html", "../contacts/"],
    ["knowledge/statya-1/index.html", "../../contacts/"]
  ]);

  for (const [path, href] of headers) {
    assert.ok(read(path).includes(`href="${href}">Контакты</a>`), `${path} must link to ${href}`);
  }
});

test("contacts page exposes active navigation and responsive layout", () => {
  const html = read("contacts/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /href="\.\/" aria-current="page">Контакты<\/a>/);
  assert.match(html, /prototype\.css\?v=20260820-2/);
  assert.match(css, /\.contacts-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.65fr\) minmax\(320px, 0\.75fr\)/s);
  assert.match(css, /\.contacts-map\s*\{[^}]*min-height:\s*500px/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.contacts-layout\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width:\s*900px\)[\s\S]*\.contacts-map\s*\{[^}]*min-height:\s*0/s);
});
