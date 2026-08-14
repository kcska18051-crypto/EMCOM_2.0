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
  assert.match(html, /src="assets\/js\/header\.js\?v=20260814-3"/);
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

test("approved single-row desktop header and mobile navigation are present", () => {
  const html = read("index.html");
  const css = read("assets/css/prototype.css");

  assert.match(html, /<div class="header-bar">/);
  assert.match(html, /class="mobile-menu-toggle"[^>]*aria-controls="main-nav"[^>]*data-mobile-menu-toggle/);
  assert.match(html, /<nav class="site-nav" id="main-nav"[^>]*data-mobile-menu/);
  assert.match(html, /class="nav-cta" href="#feedback-title">Форма обратной связи<\/a>/);
  assertInOrder(html, [
    "О компании",
    "Решения",
    "Услуги",
    "Кейсы",
    "Производство",
    "База знаний",
    "Контакты",
    "Форма обратной связи",
  ]);
  assert.match(css, /\.header-bar\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.mobile-menu-toggle\s*\{[^}]*display:\s*flex/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.site-nav\.is-open\s*\{[^}]*display:\s*block/s);
});

test("desktop header keeps the menu beside the logo while the burger stays mobile-only", () => {
  const css = read("assets/css/prototype.css");
  const desktopCss = css.split("@media (max-width: 900px)")[0];

  assert.match(desktopCss, /\.mobile-menu-toggle\s*\{[^}]*display:\s*none/s);
  assert.match(desktopCss, /\.site-nav\s*\{[^}]*flex:\s*1 1 auto[^}]*margin-left:\s*40px/s);
  assert.match(desktopCss, /\.nav-list\s*\{[^}]*justify-content:\s*space-between/s);
});

test("mobile menu helper synchronizes expanded state and panel class", async () => {
  const module = await import("../assets/js/header.js");
  const attributes = new Map();
  const classes = new Set();
  const button = { setAttribute: (name, value) => attributes.set(name, value) };
  const menu = {
    setAttribute: (name, value) => attributes.set(`menu:${name}`, value),
    classList: {
      toggle(name, enabled) {
        enabled ? classes.add(name) : classes.delete(name);
      },
    },
  };

  module.setMobileMenuState(button, menu, true);
  assert.equal(attributes.get("aria-expanded"), "true");
  assert.equal(attributes.get("menu:aria-hidden"), "false");
  assert.equal(classes.has("is-open"), true);

  module.setMobileMenuState(button, menu, false);
  assert.equal(attributes.get("aria-expanded"), "false");
  assert.equal(attributes.get("menu:aria-hidden"), "true");
  assert.equal(classes.has("is-open"), false);
});

test("approved CTA banner and eight service cards follow the feature block", () => {
  const html = read("index.html");
  const featuresPosition = html.lastIndexOf("data-feature");
  const bannerPosition = html.indexOf('class="brief-cta"');
  const servicesPosition = html.indexOf('class="services"');

  assert.ok(featuresPosition < bannerPosition, "CTA banner must follow features");
  assert.ok(bannerPosition < servicesPosition, "services must follow CTA banner");

  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.match(html, /Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor\./);
  assert.match(html, /Отправить техническое задание/);
  assert.match(html, /Какую задачу необходимо решить\?/);
  assert.match(html, /Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor/);

  assert.equal((html.match(/data-service-card/g) ?? []).length, 8);
  assertInOrder(html, [
    "Автономное и резервное электроснабжение",
    "Трансформация и распределение электроэнергии",
    "Теплоснабжение",
    "Водоподготовка и очистка стоков",
    "Насосные и компрессорные станции",
    "Модульные ЦОД и аппаратные",
    "Проектирование и строительство",
    "Нестандартное модульное решение",
  ]);
});

test("approved about-company block follows the services", () => {
  const html = read("index.html");
  const lastServicePosition = html.lastIndexOf("data-service-card");
  const aboutPosition = html.indexOf('class="about-company"');
  const mediaPosition = html.indexOf('class="about-media media-placeholder"');

  assert.ok(lastServicePosition < aboutPosition, "about-company block must follow services");
  assert.match(html, /Почему выбирают ЭМКОМ\?/);
  assert.match(html, /Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor\. Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor/);
  assert.equal((html.match(/data-about-feature(?=[\s>])/g) ?? []).length, 5);
  assert.equal((html.match(/data-about-feature-icon/g) ?? []).length, 5);
  assertInOrder(html, [
    "Полный цикл работ",
    "Собственное производство",
    "Заводская готовность",
    "Опыт сложных проектов",
    "Работа в сложных условиях",
  ]);
  assert.ok(html.lastIndexOf("data-about-feature") < mediaPosition, "image placeholder must follow about features");
});

test("approved cases block follows the complete about-company block", () => {
  const html = read("index.html");
  const aboutMediaPosition = html.indexOf('class="about-media media-placeholder"');
  const casesPosition = html.indexOf('class="cases"');

  assert.ok(aboutMediaPosition < casesPosition, "cases must follow the about-company media placeholder");
  assert.match(html, /<h2 id="cases-title">Кейсы<\/h2>/);
  assert.match(html, /Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor\. Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor/);
  assert.equal((html.match(/data-case-card(?=[\s>])/g) ?? []).length, 3);
  assertInOrder(html, ["Проект 1", "Проект 2", "Проект 3"]);
  assert.match(html, /<span class="cases-all-control" aria-disabled="true">Все проекты<\/span>/);
  assert.match(html, /<span class="cases-load-control" aria-disabled="true">Загрузить еще<\/span>/);
  assert.doesNotMatch(html, /<button[^>]*class="cases-(?:all|load)-control"/);
});

test("approved production banner follows the complete cases block", () => {
  const html = read("index.html");
  const loadControlPosition = html.indexOf('class="cases-load-control"');
  const bannerPosition = html.indexOf('class="production-banner media-placeholder"');

  assert.ok(loadControlPosition < bannerPosition, "production banner must follow the cases load control");
  assert.match(html, /<h2 id="production-banner-title">Производственные мощности<\/h2>/);
  assert.match(html, /Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor\. Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor/);
  assert.match(html, /<span class="production-banner-control" aria-disabled="true">Подробнее<\/span>/);
  assert.doesNotMatch(html, /<button[^>]*class="production-banner-control"/);
});

test("production banner keeps its desktop height over the shared media placeholder rule", () => {
  const css = read("assets/css/prototype.css");
  assert.match(css, /\.production-banner\.media-placeholder\s*\{[^}]*min-height:\s*520px/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*\.production-banner\.media-placeholder\s*\{[^}]*min-height:\s*480px/s);
});

test("approved six-card work stages mosaic follows the production banner", () => {
  const html = read("index.html");
  const productionPosition = html.indexOf('class="production-banner media-placeholder"');
  const stagesPosition = html.indexOf('class="work-stages"');

  assert.ok(productionPosition < stagesPosition, "work stages must follow the production banner");
  assert.match(html, /<h2 id="work-stages-title">Этапы работы<\/h2>/);
  assert.match(html, /Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor\. Lorem ipsum dolor sit amet, consectetuer adipiscing elit\. Aenean commodo ligula eget dolor/);
  assert.equal((html.match(/data-work-stage(?=[\s>])/g) ?? []).length, 6);
  assertInOrder(html, [
    "Этап 1: Получаем техническое задание и уточняем исходные данные.",
    "Этап 2: Разрабатываем техническую концепцию и готовим коммерческое предложение.",
    "Этап 3: Выполняем проектирование.",
    "Этап 4: Производим и комплектуем объект и проводим заводские испытания.",
    "Этап 5: Доставляем оборудование.",
    "Этап 6: Выполняем монтаж и ПНР и Передаём объект заказчику.",
  ]);
  assert.doesNotMatch(html, /Этап 10/);
});

test("approved feedback form follows the work stages", () => {
  const html = read("index.html");
  const lastStagePosition = html.lastIndexOf("data-work-stage");
  const feedbackPosition = html.indexOf('class="feedback"');

  assert.ok(lastStagePosition < feedbackPosition, "feedback form must follow work stages");
  assertInOrder(html, [
    "НАЧАТЬ ПРОЕКТ",
    "Обсудим вашу техническую задачу",
    "Направьте краткое описание проекта или готовое техническое задание. Специалисты ЭМКОМ изучат исходные данные и свяжутся с вами для уточнения требований.",
    "+7 (812) 000-00-00",
    "info@emkom.spb.ru",
    "Имя",
    "Компания",
    "Телефон",
    "Электронная почта",
    "Краткое описание задачи",
    "+ Прикрепить техническое задание",
    "Передать проект",
  ]);
  assert.equal((html.match(/data-feedback-field(?=[\s>])/g) ?? []).length, 5);
  assert.match(html, /Как к вам обращаться/);
  assert.match(html, /Название организации/);
  assert.match(html, /\+7 \(___\) ___-__-__/);
  assert.match(html, /name@company\.ru/);
  assert.match(html, /Расскажите об объекте и требуемом оборудовании/);
  assert.match(html, /с политикой обработки персональных данных/);
  assert.doesNotMatch(html, /<form/);
  assert.match(html, /class="feedback-submit"[^>]*aria-disabled="true"/);
  assert.match(html, /class="feedback-upload"[^>]*aria-disabled="true"/);
});

test("empty visual footer placeholder follows the feedback form", () => {
  const html = read("index.html");
  const css = read("assets/css/prototype.css");
  const feedbackPosition = html.indexOf('class="feedback"');
  const footerPosition = html.indexOf('class="site-footer-placeholder"');

  assert.ok(feedbackPosition < footerPosition, "footer placeholder must follow feedback");
  assert.match(html, /<footer class="site-footer-placeholder" aria-label="Место для подвала сайта"><\/footer>/);
  assert.match(css, /\.site-footer-placeholder\s*\{[^}]*min-height:\s*360px/s);
  assert.match(css, /@media \(max-width: 560px\)[\s\S]*\.site-footer-placeholder\s*\{[^}]*min-height:\s*240px/s);
});

test("feedback row columns do not inherit vertical sibling spacing", () => {
  const css = read("assets/css/prototype.css");

  assert.doesNotMatch(css, /(^|\n)\.feedback-field \+ \.feedback-field,/);
  assert.match(css, /\.feedback-panel > \.feedback-field \+ \.feedback-field,/);
  assert.match(css, /\.feedback-panel > \.feedback-field-row,/);
});
