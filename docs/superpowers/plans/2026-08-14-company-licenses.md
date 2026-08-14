# Company Licenses Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить адаптивную страницу `/company/licenses/` с четырьмя карточками сертификатов, тремя карточками лицензий и взаимной навигацией по готовым страницам раздела.

**Architecture:** Новая страница использует существующие статические HTML-компоненты шапки, хлебных крошек, боковой и мобильной навигации и подвала. Специфичные карточки получают отдельные классы в общем `prototype.css`; автоматические проверки читают итоговые HTML и CSS напрямую через Node test runner.

**Tech Stack:** HTML5, CSS3, JavaScript Node.js `node:test`, GitHub Pages.

## Global Constraints

- Использовать Montserrat и серую стилистику прототипа ЭМКОМ_2.0.
- На странице ровно 4 карточки сертификатов и 3 карточки лицензий.
- Заголовки карточек и описания используют только Lorem ipsum; контент документов Aspro не переносится.
- При ширине 900 пикселей и меньше боковое меню скрывается, карточки становятся вертикальными, горизонтального переполнения нет.
- Бургер-меню остаётся одноуровневым.
- Пункт «Реквизиты» остаётся неактивным.

---

### Task 1: Зафиксировать структуру страницы и навигацию тестами

**Files:**
- Create: `tests/licenses.test.mjs`

**Interfaces:**
- Consumes: статические HTML-файлы `index.html`, `company/index.html`, `company/history/index.html`, `company/partners/index.html`.
- Produces: проверки контрактов `data-license-group`, `data-license-card`, `data-license-document` и взаимных ссылок на `/company/licenses/`.

- [ ] **Step 1: Write the failing test**

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const fileUrl = (path) => new URL(`../${path}`, import.meta.url);
const read = (path) => readFileSync(fileUrl(path), "utf8");

test("licenses page contains approved fish-only groups", () => {
  assert.ok(existsSync(fileUrl("company/licenses/index.html")));
  const html = read("company/licenses/index.html");
  const counts = [...html.matchAll(/<div class="license-list" data-license-group>([\s\S]*?)<\/div>\s*<\/section>/g)]
    .map((match) => (match[1].match(/data-license-card/g) ?? []).length);

  assert.match(html, /<h1[^>]*>Сертификаты\/лицензии<\/h1>/);
  assert.deepEqual(counts, [4, 3]);
  assert.equal((html.match(/data-license-card/g) ?? []).length, 7);
  assert.equal((html.match(/data-license-document/g) ?? []).length, 7);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /Свидетельство о государственной регистрации|пожарной безопасности|проектирование зданий/);
});

test("completed company pages link to licenses", () => {
  const pages = ["index.html", "company/index.html", "company/history/index.html", "company/partners/index.html"];
  for (const path of pages) {
    assert.match(read(path), /licenses\//, `${path} has no licenses link`);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/licenses.test.mjs`

Expected: FAIL because `company/licenses/index.html` is missing and existing navigation still contains inactive `href="#"` entries.

- [ ] **Step 3: Commit the red test**

```bash
git add tests/licenses.test.mjs
git commit -m "test: define company licenses page"
```

### Task 2: Добавить страницу и взаимные ссылки

**Files:**
- Create: `company/licenses/index.html`
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`

**Interfaces:**
- Consumes: существующие классы `site-header`, `company-page`, `company-layout`, `company-sidebar`, `company-mobile-nav`, `site-footer`.
- Produces: страница с двумя `section.licenses-section`, списками `div.license-list[data-license-group]` и карточками `article.license-card[data-license-card]`.

- [ ] **Step 1: Create the minimal page markup**

В `company/licenses/index.html` скопировать общую оболочку страницы партнёров и заменить содержимое `main` на следующую структуру:

```html
<main class="company-page">
  <div class="container">
    <h1>Сертификаты/лицензии</h1>
    <div class="breadcrumbs"><a href="../../">Главная</a><span>—</span><a href="../">О компании</a><span>—</span><span>Сертификаты/лицензии</span></div>
    <nav class="company-mobile-nav" aria-label="Подразделы компании">
      <a href="../">О компании</a><a href="../history/">История компании</a><a href="../partners/">Партнёры</a><a href="./" aria-current="page">Сертификаты/лицензии</a>
    </nav>
    <div class="company-layout">
      <aside class="company-sidebar" aria-label="Разделы компании">
        <a href="../" data-company-side-item>О компании</a><a href="../history/" data-company-side-item>История компании</a><a href="../partners/" data-company-side-item>Партнёры</a><a class="is-current" href="./" aria-current="page" data-company-side-item>Сертификаты/лицензии</a><span data-company-side-item>Реквизиты</span>
      </aside>
      <article class="company-content licenses-content">
        <section class="licenses-section">
          <h2>Сертификаты</h2><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
          <div class="license-list" data-license-group>
            <article class="license-card" data-license-card><span class="license-document-placeholder" data-license-document aria-hidden="true"></span><div class="license-card-copy"><h3>Lorem ipsum dolor sit amet</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p></div></article>
            <article class="license-card" data-license-card><span class="license-document-placeholder" data-license-document aria-hidden="true"></span><div class="license-card-copy"><h3>Aenean commodo ligula eget dolor</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean massa.</p></div></article>
            <article class="license-card" data-license-card><span class="license-document-placeholder" data-license-document aria-hidden="true"></span><div class="license-card-copy"><h3>Cum sociis natoque penatibus</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec quam felis.</p></div></article>
            <article class="license-card" data-license-card><span class="license-document-placeholder" data-license-document aria-hidden="true"></span><div class="license-card-copy"><h3>Nulla consequat massa quis enim</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec pede justo.</p></div></article>
          </div>
        </section>
        <section class="licenses-section">
          <h2>Лицензии</h2><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
          <div class="license-list" data-license-group>
            <article class="license-card" data-license-card><span class="license-document-placeholder" data-license-document aria-hidden="true"></span><div class="license-card-copy"><h3>Fringilla vel aliquet nec</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Vulputate eget arcu.</p></div></article>
            <article class="license-card" data-license-card><span class="license-document-placeholder" data-license-document aria-hidden="true"></span><div class="license-card-copy"><h3>In enim justo rhoncus ut</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Imperdiet a venenatis vitae.</p></div></article>
            <article class="license-card" data-license-card><span class="license-document-placeholder" data-license-document aria-hidden="true"></span><div class="license-card-copy"><h3>Nullam dictum felis eu pede</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Mollis pretium integer tincidunt.</p></div></article>
          </div>
        </section>
      </article>
    </div>
  </div>
</main>
```

Каждая из семи карточек имеет конкретную структуру:

```html
<article class="license-card" data-license-card>
  <span class="license-document-placeholder" data-license-document aria-hidden="true"></span>
  <div class="license-card-copy"><h3>Lorem ipsum dolor sit amet</h3><p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p></div>
</article>
```

- [ ] **Step 2: Activate reciprocal navigation**

Заменить неактивные пункты сертификатов на относительные ссылки: `company/licenses/` в корневом `index.html`, `licenses/` в `company/index.html`, `../licenses/` в страницах history и partners. В боковые и мобильные меню трёх существующих внутренних страниц добавить те же рабочие ссылки, сохранив текущие `aria-current` только у активной страницы.

- [ ] **Step 3: Run the structural tests**

Run: `node --test tests/licenses.test.mjs`

Expected: PASS, 2 tests, 0 failures.

- [ ] **Step 4: Commit the page structure**

```bash
git add index.html company/index.html company/history/index.html company/partners/index.html company/licenses/index.html tests/licenses.test.mjs
git commit -m "feat: add company licenses page"
```

### Task 3: Добавить адаптивное оформление и регрессионные проверки

**Files:**
- Modify: `assets/css/prototype.css`
- Modify: `tests/licenses.test.mjs`
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`

**Interfaces:**
- Consumes: `license-list`, `license-card`, `license-document-placeholder`, `license-card-copy`.
- Produces: горизонтальные карточки на десктопе и вертикальные карточки в `@media (max-width: 900px)`.

- [ ] **Step 1: Add a failing responsive CSS assertion**

```js
test("license cards follow desktop and mobile composition", () => {
  const css = read("assets/css/prototype.css");
  assert.match(css, /\.license-card\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*160px minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.license-card\s*\{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.license-document-placeholder\s*\{[^}]*width:\s*144px/s);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/licenses.test.mjs`

Expected: FAIL because license card CSS is absent.

- [ ] **Step 3: Add minimal responsive styles**

Добавить перед существующими медиазапросами:

```css
.licenses-section + .licenses-section { margin-top: 54px; }
.licenses-section > h2 { margin: 0 0 14px; font-size: 30px; }
.licenses-section > p { margin: 0 0 28px; color: var(--muted); line-height: 1.7; }
.license-list { border-top: 1px solid var(--line); }
.license-card { display: grid; grid-template-columns: 160px minmax(0, 1fr); gap: 36px; padding: 30px 36px; border: 1px solid var(--line); border-top: 0; background: #fff; }
.license-document-placeholder { display: block; width: 144px; aspect-ratio: 144 / 200; background: #d2d2d2; }
.license-card-copy { align-self: center; }
.license-card-copy h3 { margin: 0 0 14px; font-size: 20px; line-height: 1.35; }
.license-card-copy p { margin: 0; color: var(--muted); line-height: 1.7; }
```

Внутри `@media (max-width: 900px)` добавить:

```css
.license-card { grid-template-columns: 1fr; gap: 24px; padding: 36px; }
.license-document-placeholder { width: 144px; max-width: 100%; }
.licenses-section + .licenses-section { margin-top: 42px; }
```

- [ ] **Step 4: Bump the shared CSS cache key**

Во всех пяти HTML-файлах заменить `prototype.css?v=20260814-16` на `prototype.css?v=20260814-17`.

- [ ] **Step 5: Run the complete suite**

Run: `npm test`

Expected: PASS, all tests, 0 failures.

- [ ] **Step 6: Commit responsive styles**

```bash
git add assets/css/prototype.css index.html company/index.html company/history/index.html company/partners/index.html company/licenses/index.html tests/licenses.test.mjs
git commit -m "style: adapt company licenses cards"
```

### Task 4: Визуально проверить и опубликовать

**Files:**
- Verify: `company/licenses/index.html`

**Interfaces:**
- Consumes: опубликованную feature-ветку и GitHub Pages после объединения.
- Produces: подтверждённую страницу без переполнения и с рабочими переходами.

- [ ] **Step 1: Verify desktop layouts**

На ширинах 1440 и 901 проверить: боковое меню видно; карточки горизонтальные; группы содержат 4 и 3 карточки; серые прямоугольники и рыбные тексты не выходят за контейнер.

- [ ] **Step 2: Verify mobile layouts**

На ширинах 900 и 390 проверить: боковое меню скрыто; мобильная навигация видна; карточки вертикальные; `document.documentElement.scrollWidth <= window.innerWidth`.

- [ ] **Step 3: Verify navigation and console**

Проверить переходы между company, history, partners и licenses из бокового и мобильного меню, отсутствие ошибок браузера и загрузку логотипа на опубликованной странице.

- [ ] **Step 4: Merge the approved feature branch**

Объединить `feature/company-licenses` с `main` через GitHub merge API, повторно выполнить `npm test` на локальном содержимом и открыть `https://kcska18051-crypto.github.io/EMCOM_2.0/company/licenses/?verify=20260814-17`.
