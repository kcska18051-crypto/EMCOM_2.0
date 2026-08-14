import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");

const mobileNavLinkCount = (html) => {
  const nav = html.match(/<nav class="company-mobile-nav"[\s\S]*?<\/nav>/)?.[0] ?? "";
  return (nav.match(/<a /g) ?? []).length;
};

test("partners page contains two approved fish-only card groups", () => {
  assert.ok(existsSync(fileUrl("company/partners/index.html")), "company/partners/index.html is missing");

  const html = read("company/partners/index.html");
  const groupCardCounts = [...html.matchAll(/<div class="partner-grid" data-partner-group>([\s\S]*?)<\/div>/g)]
    .map((match) => (match[1].match(/data-partner-card/g) ?? []).length);

  assert.match(html, /<h1[^>]*>Партнёры<\/h1>/);
  assert.match(html, /<span>Партнёры<\/span>/);
  assert.equal((html.match(/data-partner-group/g) ?? []).length, 2);
  assert.equal((html.match(/data-partner-card/g) ?? []).length, 10);
  assert.equal((html.match(/data-partner-logo/g) ?? []).length, 10);
  assert.deepEqual(groupCardCounts, [3, 7]);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /1C-Битрикс|DemoHost|Аспро\.Cloud|Разработчики|Среди решений/);
  assert.doesNotMatch(html, /<a\s[^>]*class="partner-card"/);
});

test("completed company pages expose reciprocal desktop and mobile links", () => {
  assert.ok(existsSync(fileUrl("company/partners/index.html")), "company/partners/index.html is missing");

  const homepage = read("index.html");
  const company = read("company/index.html");
  const history = read("company/history/index.html");
  const partners = read("company/partners/index.html");

  assert.match(homepage, /<li><a href="company\/partners\/">Партнёры<\/a><\/li>/);
  assert.match(company, /<a href="partners\/" data-company-side-item>Партнёры<\/a>/);
  assert.match(history, /<a href="\.\.\/partners\/" data-company-side-item>Партнёры<\/a>/);
  assert.match(partners, /<a href="\.\.\/" data-company-side-item>О компании<\/a>/);
  assert.match(partners, /<a href="\.\.\/history\/" data-company-side-item>История компании<\/a>/);
  assert.match(partners, /<a class="is-current" href="\.\/" aria-current="page" data-company-side-item>Партнёры<\/a>/);

  for (const html of [company, history, partners]) {
    assert.equal(mobileNavLinkCount(html), 4);
  }
});

test("partner cards and subsection navigation follow responsive rules", () => {
  assert.ok(existsSync(fileUrl("company/partners/index.html")), "company/partners/index.html is missing");

  const html = read("company/partners/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /href="\.\.\/\.\.\/assets\/css\/prototype\.css\?v=20260814-17"/);
  assert.match(css, /\.company-mobile-nav\s*\{[^}]*display:\s*none/s);
  assert.match(css, /\.partner-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.company-mobile-nav\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.partner-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
