import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");

const mobileNavLinkCount = (html) => {
  const nav = html.match(/<nav class="company-mobile-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  return (nav.match(/<a /g) ?? []).length;
};

test("licenses page contains approved fish-only groups", () => {
  assert.ok(existsSync(fileUrl("company/licenses/index.html")), "company/licenses/index.html is missing");

  const html = read("company/licenses/index.html");
  const counts = [...html.matchAll(/<div class="license-list" data-license-group>([\s\S]*?)<\/div>\s*<\/section>/g)]
    .map((match) => (match[1].match(/data-license-card/g) ?? []).length);

  assert.match(html, /<h1[^>]*>Сертификаты\/лицензии<\/h1>/);
  assert.match(html, /<span>Сертификаты\/лицензии<\/span>/);
  assert.deepEqual(counts, [4, 3]);
  assert.equal((html.match(/data-license-card/g) ?? []).length, 7);
  assert.equal((html.match(/data-license-document/g) ?? []).length, 7);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /Свидетельство о государственной регистрации|пожарной безопасности|проектирование зданий/);
  assert.doesNotMatch(html, /<a\s[^>]*class="license-card"/);
});

test("completed company pages expose reciprocal licenses links", () => {
  assert.ok(existsSync(fileUrl("company/licenses/index.html")), "company/licenses/index.html is missing");

  const homepage = read("index.html");
  const company = read("company/index.html");
  const history = read("company/history/index.html");
  const partners = read("company/partners/index.html");
  const licenses = read("company/licenses/index.html");

  assert.match(homepage, /<li><a href="company\/licenses\/">Сертификаты\/лицензии<\/a><\/li>/);
  assert.match(company, /<a href="licenses\/" data-company-side-item>Сертификаты\/лицензии<\/a>/);
  assert.match(history, /<a href="\.\.\/licenses\/" data-company-side-item>Сертификаты\/лицензии<\/a>/);
  assert.match(partners, /<a href="\.\.\/licenses\/" data-company-side-item>Сертификаты\/лицензии<\/a>/);
  assert.match(licenses, /<a href="\.\.\/" data-company-side-item>О компании<\/a>/);
  assert.match(licenses, /<a href="\.\.\/history\/" data-company-side-item>История компании<\/a>/);
  assert.match(licenses, /<a href="\.\.\/partners\/" data-company-side-item>Партнёры<\/a>/);
  assert.match(licenses, /<a class="is-current" href="\.\/" aria-current="page" data-company-side-item>Сертификаты\/лицензии<\/a>/);

  for (const html of [company, history, partners, licenses]) {
    assert.equal(mobileNavLinkCount(html), 4);
  }
});
