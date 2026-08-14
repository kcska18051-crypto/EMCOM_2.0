import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const assertInOrder = (text, values) => {
  let cursor = -1;
  for (const value of values) {
    const next = text.indexOf(value, cursor + 1);
    assert.notEqual(next, -1, `missing: ${value}`);
    assert.ok(next > cursor, `out of order: ${value}`);
    cursor = next;
  }
};

test("homepage contains only the approved header, hero, and feature content", () => {
  const html = read("index.html");

  assert.match(html, /fonts\.googleapis\.com\/css2\?family=Montserrat/);
  assert.match(html, /src="assets\/images\/emcom-logo\.png"/);
  assert.match(html, /data-about-toggle/);
  assert.match(html, /data-about-menu/);

  assertInOrder(html, [
    "О компании",
    "Решения",
    "Услуги",
    "Кейсы",
    "Производство",
    "База знаний",
    "Контакты",
  ]);

  assertInOrder(html, [
    "О компании",
    "История компании",
    "Партнёры",
    "Сертификаты/лицензии",
    "Реквизиты",
  ]);

  assert.match(html, /инженерно-производственная компания полного цикла/);
  assert.match(html, /Модульные инженерные решения под ключ/);
  assert.match(html, /Проектируем и производим комплексные инженерные системы для энергетики, промышленности, инфраструктуры и связи\./);
  assert.match(html, /От разработки технического решения до изготовления, поставки и ввода оборудования в эксплуатацию\./);
  assert.doesNotMatch(html, /Обсудить задачу/);

  assert.equal((html.match(/data-feature/g) ?? []).length, 6);
  assertInOrder(html, [
    "собственное производство",
    "более 20 лет опыта",
    "более 500 реализованных проектов",
    "проектирование, производство, СМР и ПНР",
    "работа по всей России",
    "решения для сложных климатических условий",
  ]);
});

test("menu state helper synchronizes aria state and visibility", async () => {
  let module;
  try {
    module = await import("../assets/js/header.js");
  } catch {
    assert.fail("assets/js/header.js is missing");
  }

  const attributes = new Map();
  const button = {
    setAttribute(name, value) {
      attributes.set(name, value);
    },
  };
  const menu = { hidden: true };

  module.setMenuState(button, menu, true);
  assert.equal(attributes.get("aria-expanded"), "true");
  assert.equal(menu.hidden, false);

  module.setMenuState(button, menu, false);
  assert.equal(attributes.get("aria-expanded"), "false");
  assert.equal(menu.hidden, true);
});
