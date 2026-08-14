import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");

const assertInOrder = (text, values) => {
  let previousIndex = -1;
  for (const value of values) {
    const index = text.indexOf(value);
    assert.ok(index > previousIndex, `${value} is missing or out of order`);
    previousIndex = index;
  }
};

test("history page contains the approved four-entry timeline", () => {
  assert.ok(existsSync(fileUrl("company/history/index.html")), "company/history/index.html is missing");

  const html = read("company/history/index.html");
  assert.match(html, /<h1[^>]*>История<\/h1>/);
  assert.match(html, /<span>История<\/span>/);
  assert.equal((html.match(/data-history-item/g) ?? []).length, 4);
  assert.equal((html.match(/data-history-image/g) ?? []).length, 2);
  assertInOrder(html, [">2009<", ">2012<", ">2015<", ">2020<"]);
  assert.match(html, /Октябрь — декабрь/);
  assert.match(html, /Июль/);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /Этапы становления компании|Команда Allcorp3/);
});

test("history and company pages link to each other in desktop navigation", () => {
  assert.ok(existsSync(fileUrl("company/history/index.html")), "company/history/index.html is missing");
  const history = read("company/history/index.html");
  const company = read("company/index.html");
  const homepage = read("index.html");

  assert.match(history, /<a href="\.\.\/" data-company-side-item>О компании<\/a>/);
  assert.match(history, /<a class="is-current" href="\.\/" aria-current="page" data-company-side-item>История компании<\/a>/);
  assert.match(company, /<a href="history\/" data-company-side-item>История компании<\/a>/);
  assert.match(company, /<li><a href="history\/">История компании<\/a><\/li>/);
  assert.match(homepage, /<li><a href="company\/history\/">История компании<\/a><\/li>/);
});

test("history timeline has wide, intermediate, and mobile layouts", () => {
  assert.ok(existsSync(fileUrl("company/history/index.html")), "company/history/index.html is missing");
  const html = read("company/history/index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /href="\.\.\/\.\.\/assets\/css\/prototype\.css\?v=20260814-17"/);
  assert.match(css, /\.history-item--with-image\s*\{[^}]*grid-template-columns:\s*88px minmax\(0, 1fr\) 303px/s);
  assert.match(css, /@media \(min-width: 901px\) and \(max-width: 1100px\)[\s\S]*\.history-image\s*\{[^}]*grid-column:\s*2/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.history-item[\s\S]*display:\s*block/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.history-image\s*\{[^}]*aspect-ratio:\s*1 \/ 1/s);
});
