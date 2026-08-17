# Team Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить в прототип страницу «Команда», одну детальную страницу сотрудника и корректные переходы из всех меню раздела компании.

**Architecture:** Две статические HTML-страницы используют существующую шапку, навигацию раздела компании, общий `prototype.css` и `header.js`. Новый тестовый файл фиксирует структуру, тексты, единственную кликабельную карточку, запрещённые блоки и адаптив; существующие тесты расширяются проверками ссылок «Команда».

**Tech Stack:** HTML5, CSS Grid, JavaScript ES modules, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Путь списка: `/company/staff/`.
- Путь детальной страницы: `/company/staff/sotrudnik/`.
- Ровно шесть карточек: серый прямоугольник, «Должность», «Фамилия имя отчество».
- Только первая карточка ведёт на детальную страницу.
- Детальная страница содержит должность, телефон, e-mail, серый портрет и два абзаца рыбного текста.
- Не добавлять реальные ФИО, услуги, проекты, отзывы, социальные сети, кнопку сообщения и форму обратной связи.
- Сетка списка: 3 карточки на десктопе, 2 на планшете, 1 на мобильном.
- Телефон и e-mail не получают `tel:` и `mailto:`.
- Все изображения остаются серыми прямоугольниками.

---

### Task 1: Зафиксировать контракт страниц команды тестами

**Files:**
- Create: `tests/team-pages.test.mjs`
- Test: `tests/team-pages.test.mjs`

**Interfaces:**
- Consumes: существующие HTML-файлы и общий `assets/css/prototype.css` через чтение файлов.
- Produces: контракт маркеров `data-team-page`, `data-team-card`, `data-team-detail-link`, `data-team-detail` и CSS-классов `.team-grid`, `.team-card`, `.team-profile`.

- [ ] **Step 1: Write the failing existence and content tests**

```js
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
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `node --test tests/team-pages.test.mjs`

Expected: FAIL because both page files do not exist.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/team-pages.test.mjs
git commit -m "test: define team pages contract"
```

---

### Task 2: Реализовать список и детальную страницу

**Files:**
- Create: `company/staff/index.html`
- Create: `company/staff/sotrudnik/index.html`
- Modify: `assets/css/prototype.css`
- Test: `tests/team-pages.test.mjs`

**Interfaces:**
- Consumes: существующие классы `.site-header`, `.company-subnav`, `.company-layout`, `.company-sidebar`, `.media-placeholder`, `.site-footer-placeholder` и `assets/js/header.js`.
- Produces: статические страницы и классы `.team-intro`, `.team-grid`, `.team-card`, `.team-card-media`, `.team-profile`, `.team-profile-media`, `.team-profile-copy`.

- [ ] **Step 1: Create the listing page with exact semantic markers**

Внутри общей оболочки страницы использовать следующий основной блок; шапку, горизонтальное и боковое меню скопировать из `company/partners/index.html`, скорректировав относительные пути:

```html
<main class="company-page team-page" data-team-page>
  <header class="company-heading">
    <h1>Команда</h1>
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
      <a href="../../">Главная</a><span aria-hidden="true">—</span>
      <a href="../">О компании</a><span aria-hidden="true">—</span><span>Команда</span>
    </nav>
  </header>
  <nav class="company-subnav" aria-label="Подразделы компании">
    <a href="../">О компании</a><a href="../history/">История компании</a>
    <a href="../partners/">Партнёры</a><a href="../licenses/">Сертификаты/лицензии</a>
    <a href="./" aria-current="page">Команда</a><a href="#">Реквизиты</a>
  </nav>
  <div class="company-layout">
    <aside class="company-sidebar" aria-label="Разделы компании">
      <a href="../">О компании</a><a href="../history/">История компании</a>
      <a href="../partners/">Партнёры</a><a href="../licenses/">Сертификаты/лицензии</a>
      <a class="is-current" href="./" aria-current="page">Команда</a><a href="#">Реквизиты</a>
    </aside>
    <section class="team-content">
      <p class="team-intro">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
      <div class="team-grid">
        <a class="team-card" href="sotrudnik/" data-team-card data-team-detail-link>
          <span class="team-card-media media-placeholder" aria-hidden="true"></span>
          <span class="team-card-role">Должность</span><strong>Фамилия имя отчество</strong>
        </a>
        <article class="team-card" data-team-card><span class="team-card-media media-placeholder" aria-hidden="true"></span><span class="team-card-role">Должность</span><strong>Фамилия имя отчество</strong></article>
        <article class="team-card" data-team-card><span class="team-card-media media-placeholder" aria-hidden="true"></span><span class="team-card-role">Должность</span><strong>Фамилия имя отчество</strong></article>
        <article class="team-card" data-team-card><span class="team-card-media media-placeholder" aria-hidden="true"></span><span class="team-card-role">Должность</span><strong>Фамилия имя отчество</strong></article>
        <article class="team-card" data-team-card><span class="team-card-media media-placeholder" aria-hidden="true"></span><span class="team-card-role">Должность</span><strong>Фамилия имя отчество</strong></article>
        <article class="team-card" data-team-card><span class="team-card-media media-placeholder" aria-hidden="true"></span><span class="team-card-role">Должность</span><strong>Фамилия имя отчество</strong></article>
      </div>
    </section>
  </div>
</main>
```

Пять некликабельных карточек имеют точную структуру:

```html
<article class="team-card" data-team-card>
  <span class="team-card-media media-placeholder" aria-hidden="true"></span>
  <span class="team-card-role">Должность</span>
  <strong>Фамилия имя отчество</strong>
</article>
```

- [ ] **Step 2: Create the detail page with exact approved content**

Использовать ту же шапку, поднавигацию и боковое меню. Основной профиль:

```html
<section class="team-profile" data-team-detail>
  <div class="team-profile-copy">
    <div class="team-profile-role"><span>Должность</span><strong>Должность</strong></div>
    <dl class="team-profile-contacts">
      <div><dt>Телефон</dt><dd>+7 (000) 000-00-00</dd></div>
      <div><dt>E-mail</dt><dd>name@company.ru</dd></div>
    </dl>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
    <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec.</p>
  </div>
  <div class="team-profile-media media-placeholder" aria-label="Место для фотографии сотрудника"></div>
</section>
```

Заголовок страницы — `Фамилия имя отчество`; хлебные крошки содержат ссылки на `../../` и `../`, затем текущую страницу.

- [ ] **Step 3: Add the desktop and responsive CSS**

```css
.team-content { min-width: 0; }
.team-intro { max-width: 860px; margin: 0 0 34px; color: var(--color-muted); line-height: 1.7; }
.team-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 28px; }
.team-card { display: grid; min-width: 0; color: var(--color-text); text-decoration: none; }
.team-card-media { aspect-ratio: 4 / 5; }
.team-card-role { margin-top: 18px; color: var(--color-muted); font-size: 13px; }
.team-card strong { margin-top: 7px; font-size: 17px; line-height: 1.4; }
.team-profile { display: grid; padding: 44px; border: 1px solid var(--color-border); grid-template-columns: minmax(0, 1fr) minmax(280px, 0.42fr); gap: 56px; }
.team-profile-media { aspect-ratio: 1 / 1; }
.team-profile-role span, .team-profile-contacts dt { color: var(--color-muted); font-size: 13px; }
.team-profile-role strong { display: block; margin-top: 8px; font-size: 20px; }
.team-profile-contacts { display: grid; margin: 42px 0 34px; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px; }
.team-profile-contacts div { margin: 0; }
.team-profile-contacts dt, .team-profile-contacts dd { margin: 0; }
.team-profile-contacts dd { margin-top: 7px; overflow-wrap: anywhere; }
.team-profile-copy p { line-height: 1.75; }

@media (max-width: 1100px) {
  .team-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .team-profile { grid-template-columns: minmax(0, 1fr) minmax(240px, 0.5fr); gap: 36px; }
}

@media (max-width: 700px) {
  .team-grid { grid-template-columns: 1fr; }
  .team-profile { grid-template-columns: 1fr; padding: 24px 20px; gap: 28px; }
  .team-profile-copy { display: contents; }
  .team-profile-role { order: 1; }
  .team-profile-media { order: 2; }
  .team-profile-contacts { order: 3; grid-template-columns: 1fr; margin: 0; }
  .team-profile-copy p { order: 4; }
}
```

- [ ] **Step 4: Extend the responsive test and verify GREEN**

```js
test("team pages expose the approved responsive layouts", () => {
  const css = read("assets/css/prototype.css");
  assert.match(css, /\.team-grid\s*\{[^}]*grid-template-columns:\s*repeat\(3,/s);
  assert.match(css, /@media \(max-width:\s*1100px\)[\s\S]*\.team-grid\s*\{[^}]*repeat\(2,/s);
  assert.match(css, /@media \(max-width:\s*700px\)[\s\S]*\.team-grid\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width:\s*700px\)[\s\S]*\.team-profile\s*\{[^}]*grid-template-columns:\s*1fr/s);
});
```

Run: `node --test tests/team-pages.test.mjs`

Expected: all team-page tests PASS.

- [ ] **Step 5: Commit the pages**

```bash
git add company/staff/index.html company/staff/sotrudnik/index.html assets/css/prototype.css tests/team-pages.test.mjs
git commit -m "feat: add team prototype pages"
```

---

### Task 3: Связать страницу «Команда» со всеми меню

**Files:**
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`
- Modify: `solutions/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Modify: `services/index.html`
- Modify: `services/predproektnoe-obsledovanie/index.html`
- Modify: `cases/index.html`
- Modify: `cases/proekt-1/index.html`
- Modify: `production/index.html`
- Modify: `knowledge/index.html`
- Modify: `knowledge/statya-1/index.html`
- Modify: `contacts/index.html`
- Modify: `tests/team-pages.test.mjs`
- Modify: `tests/homepage.test.mjs`

**Interfaces:**
- Consumes: относительная глубина каждой HTML-страницы.
- Produces: единый пункт «Команда» в каждом десктопном выпадающем меню и во всех меню подразделов компании.

- [ ] **Step 1: Add a failing navigation test**

```js
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
```

Run: `node --test tests/team-pages.test.mjs`

Expected: FAIL because existing menus do not contain «Команда».

- [ ] **Step 2: Add the header links using the exact relative paths**

В каждом `about-menu` после ссылки «Сертификаты/лицензии» добавить ссылку с точным путём из списка ниже:

```text
index.html                                                            company/staff/
company/index.html                                                    staff/
company/history/index.html                                            ../staff/
company/partners/index.html                                           ../staff/
company/licenses/index.html                                           ../staff/
solutions/index.html                                                  ../company/staff/
solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html         ../../company/staff/
solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html
                                                                      ../../../company/staff/
services/index.html                                                   ../company/staff/
services/predproektnoe-obsledovanie/index.html                         ../../company/staff/
cases/index.html                                                      ../company/staff/
cases/proekt-1/index.html                                             ../../company/staff/
production/index.html                                                 ../company/staff/
knowledge/index.html                                                  ../company/staff/
knowledge/statya-1/index.html                                         ../../company/staff/
contacts/index.html                                                   ../company/staff/
```

Каждый путь оформляется как пункт списка `<li><a href="…">Команда</a></li>`; многоточие заменяется соответствующим буквальным значением из таблицы.

- [ ] **Step 3: Add team links to company subnavigation and sidebar**

В четырёх существующих страницах `company/` после «Сертификаты/лицензии» добавить ссылку на `staff/` или `../staff/`:

```html
<a href="staff/">Команда</a>
```

На новых страницах ссылка уже активна; на существующих страницах она не получает `aria-current`.

- [ ] **Step 4: Update the existing approved menu-item test**

В `tests/homepage.test.mjs` добавить строку `"Команда"` в массив ожидаемых пунктов после `"Сертификаты/лицензии"` и перед `"Реквизиты"`.

- [ ] **Step 5: Run focused tests**

Run: `node --test tests/team-pages.test.mjs tests/homepage.test.mjs tests/company.test.mjs tests/history.test.mjs tests/partners.test.mjs tests/licenses.test.mjs`

Expected: all focused tests PASS.

- [ ] **Step 6: Commit navigation**

```bash
git add index.html company solutions services cases production knowledge contacts tests
git commit -m "feat: link team pages across navigation"
```

---

### Task 4: Обновить cache key и проверить полный проект

**Files:**
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`
- Modify: `company/staff/index.html`
- Modify: `company/staff/sotrudnik/index.html`
- Modify: `solutions/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Modify: `services/index.html`
- Modify: `services/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`
- Modify: `services/predproektnoe-obsledovanie/index.html`
- Modify: `cases/index.html`
- Modify: `cases/proekt-1/index.html`
- Modify: `production/index.html`
- Modify: `knowledge/index.html`
- Modify: `knowledge/statya-1/index.html`
- Modify: `contacts/index.html`
- Modify: тесты с точным ожиданием cache key

**Interfaces:**
- Consumes: текущий cache key `20260817-11`.
- Produces: единый следующий cache key `20260817-12` во всех HTML и точных тестах.

- [ ] **Step 1: Replace the cache key everywhere**

Во всех HTML и тестах заменить:

```text
20260817-11
```

на:

```text
20260817-12
```

- [ ] **Step 2: Confirm no stale key remains**

Run: `rg -n "20260817-11" --glob "!docs/**"`

Expected: no output.

- [ ] **Step 3: Run the complete suite**

Run: `npm test`

Expected: all tests PASS, zero failures.

- [ ] **Step 4: Commit cache update**

```bash
git add .
git commit -m "chore: refresh prototype stylesheet cache key"
```

---

### Task 5: Опубликовать и визуально проверить GitHub Pages

**Files:**
- No source changes unless verification reveals a reproducible defect.

**Interfaces:**
- Consumes: tested feature branch.
- Produces: merged `main`, successful Pages deployment and verified public URLs.

- [ ] **Step 1: Push the implementation branch and merge it into main**

```bash
git push -u origin feature-team-pages-20260817
gh api repos/kcska18051-crypto/EMCOM_2.0/merges \
  -f base=main \
  -f head=feature-team-pages-20260817 \
  -f commit_message="Merge team prototype pages"
```

- [ ] **Step 2: Wait for the Pages deployment**

Run: `gh run list --repo kcska18051-crypto/EMCOM_2.0 --limit 3 --json databaseId,workflowName,status,conclusion,headSha`

Expected: `pages-build-deployment` for the merged main SHA completes with `conclusion: success`.

- [ ] **Step 3: Verify the public listing page at desktop width**

Open: `https://kcska18051-crypto.github.io/EMCOM_2.0/company/staff/?verify=20260817-12`

Verify: six cards, three columns, one detail link, visible gray rectangles, no horizontal overflow.

- [ ] **Step 4: Verify the public detail page at desktop width**

Open: `https://kcska18051-crypto.github.io/EMCOM_2.0/company/staff/sotrudnik/?verify=20260817-12`

Verify: role and contacts left, gray portrait right, two fish-text paragraphs, no forbidden sections.

- [ ] **Step 5: Verify both pages at 390 × 844**

Verify: one-column cards; detail order is heading/role → portrait → contacts → description; burger works; `scrollWidth <= innerWidth`.

- [ ] **Step 6: Re-run tests on merged main**

```bash
git switch main
git pull --ff-only
npm test
```

Expected: all tests PASS, zero failures.

- [ ] **Step 7: Delete merged temporary branches after confirming `ahead_by: 0`**

Check and remove `feature-team-pages-20260817` and `spec-team-pages-20260817`. Keep only `main`.
