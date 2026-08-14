# Services Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить адаптивную страницу `/services/` с боковым меню, восемью карточками услуг и рабочими переходами из шапок всех готовых страниц.

**Architecture:** Новая статическая страница повторяет существующую оболочку внутренних страниц, но использует собственные классы `services-page-*`. Структура и навигация проверяются Node-тестами, а сетка управляется общим `prototype.css` с точными брейкпоинтами 1200 и 900 пикселей.

**Tech Stack:** HTML5, CSS3, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Использовать существующие шапку, подвал, Montserrat и серую стилистику ЭМКОМ_2.0.
- Показать ровно восемь утверждённых услуг в утверждённом порядке.
- Карточки и боковые пункты не являются ссылками.
- Сетка: 3 колонки от 1201 px, 2 колонки от 901 до 1200 px, 1 колонка при 900 px и меньше.
- При 900 px и меньше боковое меню скрыто, карточка имеет высоту не менее 280 px.
- Карточки главной страницы остаются некликабельными.

---

### Task 1: Зафиксировать страницу и навигацию тестами

**Files:**
- Create: `tests/services-page.test.mjs`

**Interfaces:**
- Consumes: статические HTML-файлы проекта.
- Produces: контракты `data-services-side-item`, `data-services-card` и ссылка `services/` в шапке.

- [ ] **Step 1: Write the failing structure test**

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");
const services = [
  "Автономное и резервное электроснабжение",
  "Трансформация и распределение электроэнергии",
  "Теплоснабжение",
  "Водоподготовка и очистка стоков",
  "Насосные и компрессорные станции",
  "Модульные ЦОД и аппаратные",
  "Проектирование и строительство",
  "Нестандартное модульное решение",
];

test("services page contains approved sidebar and cards", () => {
  assert.ok(existsSync(fileUrl("services/index.html")));
  const html = read("services/index.html");
  assert.match(html, /<h1[^>]*>Услуги<\/h1>/);
  assert.equal((html.match(/data-services-side-item/g) ?? []).length, 8);
  assert.equal((html.match(/data-services-card/g) ?? []).length, 8);
  for (const name of services) assert.equal((html.match(new RegExp(name, "g")) ?? []).length, 2);
  assert.doesNotMatch(html, /<a[^>]*data-services-(?:side-item|card)/);
});

test("all completed headers link to services", () => {
  const pages = ["index.html", "company/index.html", "company/history/index.html", "company/partners/index.html", "company/licenses/index.html"];
  for (const path of pages) assert.match(read(path), /class="nav-link" href="(?:\.\.\/)*services\/">Услуги<\/a>/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/services-page.test.mjs`

Expected: FAIL because `services/index.html` is missing.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/services-page.test.mjs
git commit -m "test: define services page"
```

### Task 2: Создать страницу и связать шапки

**Files:**
- Create: `services/index.html`
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`

**Interfaces:**
- Consumes: существующие компоненты `site-header`, `company-page`, `company-heading`, `breadcrumbs`, `site-footer-placeholder`.
- Produces: `aside.services-page-sidebar` и `div.services-page-grid` с восемью карточками.

- [ ] **Step 1: Create the page shell and content**

Создать `services/index.html` с общей шапкой и подвалом внутренних страниц. Основной блок имеет следующую полную структуру:

```html
<main class="company-page services-page">
  <header class="company-heading">
    <h1>Услуги</h1>
    <nav class="breadcrumbs" aria-label="Хлебные крошки"><a href="../">Главная</a><span aria-hidden="true">—</span><span>Услуги</span></nav>
  </header>
  <div class="services-page-layout">
    <aside class="services-page-sidebar" aria-label="Перечень услуг">
      <span data-services-side-item>Автономное и резервное электроснабжение</span>
      <span data-services-side-item>Трансформация и распределение электроэнергии</span>
      <span data-services-side-item>Теплоснабжение</span>
      <span data-services-side-item>Водоподготовка и очистка стоков</span>
      <span data-services-side-item>Насосные и компрессорные станции</span>
      <span data-services-side-item>Модульные ЦОД и аппаратные</span>
      <span data-services-side-item>Проектирование и строительство</span>
      <span data-services-side-item>Нестандартное модульное решение</span>
    </aside>
    <article class="services-page-content">
      <p class="services-page-lead">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
      <div class="services-page-grid">
        <article class="services-page-card" data-services-card><h2>Автономное и резервное электроснабжение</h2></article>
        <article class="services-page-card" data-services-card><h2>Трансформация и распределение электроэнергии</h2></article>
        <article class="services-page-card" data-services-card><h2>Теплоснабжение</h2></article>
        <article class="services-page-card" data-services-card><h2>Водоподготовка и очистка стоков</h2></article>
        <article class="services-page-card" data-services-card><h2>Насосные и компрессорные станции</h2></article>
        <article class="services-page-card" data-services-card><h2>Модульные ЦОД и аппаратные</h2></article>
        <article class="services-page-card" data-services-card><h2>Проектирование и строительство</h2></article>
        <article class="services-page-card" data-services-card><h2>Нестандартное модульное решение</h2></article>
      </div>
    </article>
  </div>
</main>
```

- [ ] **Step 2: Activate header links**

В корневом `index.html` заменить `href="#"` пункта «Услуги» на `href="services/"`. На страницах `/company/`, `/company/history/`, `/company/partners/` и `/company/licenses/` заменить его на `href="../../services/"` или `href="../services/"` согласно глубине файла. В `services/index.html` пункт шапки использует `href="./"`.

- [ ] **Step 3: Run structure tests**

Run: `node --test tests/services-page.test.mjs`

Expected: PASS, 2 tests, 0 failures.

- [ ] **Step 4: Commit the page structure**

```bash
git add services/index.html index.html company/index.html company/history/index.html company/partners/index.html company/licenses/index.html tests/services-page.test.mjs
git commit -m "feat: add services page structure"
```

### Task 3: Реализовать адаптивную сетку

**Files:**
- Modify: `assets/css/prototype.css`
- Modify: `tests/services-page.test.mjs`
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`
- Modify: `services/index.html`
- Modify: `tests/foundation.test.mjs`
- Modify: `tests/company.test.mjs`
- Modify: `tests/history.test.mjs`
- Modify: `tests/partners.test.mjs`
- Modify: `tests/licenses.test.mjs`

**Interfaces:**
- Consumes: `services-page-layout`, `services-page-sidebar`, `services-page-grid`, `services-page-card`.
- Produces: exact 3/2/1-column behavior and hidden mobile sidebar.

- [ ] **Step 1: Add failing CSS assertions**

```js
test("services page follows approved responsive grid", () => {
  const html = read("services/index.html");
  const css = read("assets/css/prototype.css");
  assert.match(html, /prototype\.css\?v=20260814-18/);
  assert.match(css, /\.services-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 1200px\)[\s\S]*\.services-page-grid\s*\{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.services-page-sidebar\s*\{[^}]*display:\s*none/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.services-page-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/services-page.test.mjs`

Expected: FAIL because services page styles and cache key 18 are absent.

- [ ] **Step 3: Add desktop styles**

```css
.services-page-layout { display: grid; width: min(calc(100% - 64px), 1370px); margin-inline: auto; padding-bottom: 96px; grid-template-columns: 280px minmax(0, 1fr); align-items: start; gap: 68px; }
.services-page-sidebar { border-top: 1px solid var(--color-border); }
.services-page-sidebar span { display: flex; min-height: 62px; padding: 16px 18px; border-bottom: 1px solid var(--color-border); align-items: center; color: var(--color-muted); font-size: 14px; line-height: 1.4; }
.services-page-content { min-width: 0; }
.services-page-lead { margin: 0 0 34px; color: var(--color-muted); font-size: 15px; line-height: 1.7; }
.services-page-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 30px; }
.services-page-card { display: flex; min-width: 0; min-height: 390px; padding: 28px; align-items: flex-end; background: var(--color-placeholder); }
.services-page-card h2 { margin: 0; font-size: 18px; line-height: 1.35; }
```

- [ ] **Step 4: Add intermediate and mobile styles**

```css
@media (max-width: 1200px) and (min-width: 901px) {
  .services-page-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 900px) {
  .services-page-layout { display: block; width: min(calc(100% - 48px), 1370px); padding-bottom: 72px; }
  .services-page-sidebar { display: none; }
  .services-page-grid { grid-template-columns: 1fr; gap: 24px; }
  .services-page-card { min-height: 280px; }
}
```

- [ ] **Step 5: Bump and update the CSS cache key**

Во всех шести HTML-файлах и тестах заменить `prototype.css?v=20260814-17` на `prototype.css?v=20260814-18`.

- [ ] **Step 6: Run the full suite**

Run: `npm test`

Expected: PASS, all tests, 0 failures.

- [ ] **Step 7: Commit responsive styles**

```bash
git add assets/css/prototype.css services/index.html index.html company tests
git commit -m "style: adapt services page"
```

### Task 4: Проверить и опубликовать

**Files:**
- Verify: `services/index.html`

**Interfaces:**
- Consumes: feature-ветку и опубликованную GitHub Pages версию.
- Produces: проверенную страницу `/services/`.

- [ ] **Step 1: Verify desktop and intermediate widths**

На ширинах 1440, 1201, 1200 и 901 проверить боковое меню, 3 колонки от 1201 и 2 колонки до 901.

- [ ] **Step 2: Verify mobile widths**

На 900 и 390 проверить скрытое боковое меню, одну колонку, высоту карточек не менее 280 px и `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 3: Verify navigation**

Открыть `/services/` через пункт «Услуги» на главной странице и проверить те же ссылки в шапках четырёх страниц раздела «О компании».

- [ ] **Step 4: Merge and verify public deployment**

Объединить `feature/services-page` с `main`, повторить `npm test` и открыть `https://kcska18051-crypto.github.io/EMCOM_2.0/services/?verify=20260814-18`.
