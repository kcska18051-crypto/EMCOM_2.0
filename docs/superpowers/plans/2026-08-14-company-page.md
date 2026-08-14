# Company Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить адаптивную страницу `/company/` по композиции Aspro и привести мобильный пункт «О компании» к прямой ссылке без вложенного меню.

**Architecture:** Страница создаётся как статический `company/index.html` и переиспользует общие `assets/css/prototype.css`, `assets/js/header.js`, логотип и футер-плейсхолдер. Десктопная и мобильная версии навигации получают отдельные элементы «О компании», переключаемые CSS на брейкпоинте 900 px; новая страница использует отдельные классы `company-*`, чтобы не менять композицию главной.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Название страницы: «О компании».
- Внутренние заголовки и тексты используют только согласованный Lorem ipsum.
- Боковое меню: О компании, История компании, Партнёры, Сертификаты/лицензии, Реквизиты.
- Промобаннер под боковым меню отсутствует.
- На мобильном боковое меню и вложенный список шапки отсутствуют.
- Изображение заменяется серым прямоугольником.
- Изменения выполняются в `feature/company-page`, после проверки объединяются с `main`.

---

### Task 1: Зафиксировать структуру страницы и поведение навигации тестами

**Files:**
- Create: `tests/company.test.mjs`
- Modify: `tests/homepage.test.mjs`

**Interfaces:**
- Consumes: файловая структура проекта и существующий HTML/CSS-контракт шапки.
- Produces: проверки файла `company/index.html`, пяти пунктов бокового меню, рыбных заголовков, серого изображения и мобильной прямой ссылки `.nav-link--mobile`.

- [ ] **Step 1: Write the failing tests**

```js
test("company page follows the approved Aspro content structure", () => {
  const html = read("company/index.html");
  assert.match(html, /<h1[^>]*>О компании<\/h1>/);
  assert.equal((html.match(/data-company-side-item/g) ?? []).length, 5);
  assert.match(html, /class="company-media media-placeholder"/);
  assert.match(html, /<h2>Lorem ipsum dolor sit amet<\/h2>/);
  assert.match(html, /<h2>Aenean vulputate eleifend tellus<\/h2>/);
  assert.doesNotMatch(html, /Чем мы можем быть вам полезны|Что уже сделано/);
});

test("mobile company navigation is direct and has no nested list", () => {
  const html = read("index.html");
  const css = read("assets/css/prototype.css");
  assert.match(html, /class="nav-link nav-link--mobile" href="company\/">О компании<\/a>/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.nav-toggle--desktop[^}]*display:\s*none/);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.nav-item--dropdown \.about-menu[^}]*display:\s*none/);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`

Expected: FAIL because `company/index.html` and the mobile direct-link classes do not exist.

- [ ] **Step 3: Keep the tests unchanged for implementation**

No production code is changed in this task.

- [ ] **Step 4: Commit the red tests**

Upload `tests/company.test.mjs` and `tests/homepage.test.mjs` to `feature/company-page` with commit message `test: specify company page prototype`.

### Task 2: Implement direct mobile navigation

**Files:**
- Modify: `index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: existing `.nav-item--dropdown`, `.nav-toggle`, `.about-menu` and mobile breakpoint 900 px.
- Produces: `.nav-link--mobile` as a direct link and `.nav-toggle--desktop` as a desktop-only dropdown trigger.

- [ ] **Step 1: Add separate desktop and mobile controls**

```html
<a class="nav-link nav-link--mobile" href="company/">О компании</a>
<button class="nav-link nav-toggle nav-toggle--desktop" type="button"
        aria-expanded="false" aria-controls="about-menu" data-about-toggle>
  О компании
</button>
```

- [ ] **Step 2: Add responsive visibility rules**

```css
.nav-link--mobile { display: none; }

@media (max-width: 900px) {
  .nav-link--mobile { display: flex; }
  .nav-toggle--desktop,
  .nav-item--dropdown .about-menu { display: none; }
}
```

- [ ] **Step 3: Link the first desktop dropdown item**

```html
<li><a href="company/">О компании</a></li>
```

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: company-file test remains failing; mobile navigation assertions pass.

- [ ] **Step 5: Commit navigation implementation**

Upload `index.html` and `assets/css/prototype.css` with commit message `feat: simplify mobile company navigation`.

### Task 3: Build the company page

**Files:**
- Create: `company/index.html`
- Modify: `assets/css/prototype.css`
- Modify: `tests/foundation.test.mjs`

**Interfaces:**
- Consumes: shared header markup, `../assets/images/emcom-logo.png`, `../assets/js/header.js`, `.media-placeholder` and `.site-footer-placeholder`.
- Produces: `.company-page`, `.company-heading`, `.company-layout`, `.company-sidebar`, `.company-content`, `.company-media`, `.company-copy-section`.

- [ ] **Step 1: Create semantic page markup**

```html
<main class="company-page">
  <header class="company-heading">
    <h1>О компании</h1>
    <nav class="breadcrumbs" aria-label="Хлебные крошки">
      <a href="../">Главная</a><span>—</span><span>О компании</span>
    </nav>
  </header>
  <div class="company-layout">
    <aside class="company-sidebar" aria-label="Разделы компании">
      <a class="is-current" href="./" data-company-side-item>О компании</a>
      <span data-company-side-item>История компании</span>
      <span data-company-side-item>Партнёры</span>
      <span data-company-side-item>Сертификаты/лицензии</span>
      <span data-company-side-item>Реквизиты</span>
    </aside>
    <article class="company-content">
      <div class="company-media media-placeholder" role="img" aria-label="Изображение о компании"></div>
      <p class="company-lead">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</p>
      <section class="company-copy-section">
        <h2>Lorem ipsum dolor sit amet</h2>
        <ul>
          <li>Nulla consequat massa quis enim.</li>
          <li>Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.</li>
          <li>In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.</li>
        </ul>
        <p>Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi.</p>
      </section>
      <section class="company-copy-section">
        <h2>Aenean vulputate eleifend tellus</h2>
        <ul>
          <li>Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.</li>
          <li>Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.</li>
          <li>Phasellus viverra nulla ut metus varius laoreet.</li>
        </ul>
        <p>Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo.</p>
      </section>
    </article>
  </div>
</main>
```

- [ ] **Step 2: Add desktop layout**

```css
.company-page { padding-top: 96px; background: var(--color-surface); }
.company-heading,
.company-layout { width: min(calc(100% - 64px), 1370px); margin-inline: auto; }
.company-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 68px; }
.company-media { width: 100%; aspect-ratio: 2 / 1; min-height: 0; }
```

- [ ] **Step 3: Add mobile layout**

```css
@media (max-width: 900px) {
  .company-page { padding-top: 62px; }
  .company-heading,
  .company-layout { width: min(calc(100% - 48px), 1370px); }
  .company-layout { display: block; }
  .company-sidebar { display: none; }
  .company-media { aspect-ratio: 1.45 / 1; }
}
```

- [ ] **Step 4: Bump the CSS cache key**

Use `prototype.css?v=20260814-13` in both HTML pages and update `tests/foundation.test.mjs` accordingly.

- [ ] **Step 5: Run all tests**

Run: `npm test`

Expected: all tests PASS with zero failures.

- [ ] **Step 6: Commit company page implementation**

Upload the new page, stylesheet and cache-key test with commit message `feat: add company page prototype`.

### Task 4: Verify responsive behavior and publish

**Files:**
- Verify: `index.html`
- Verify: `company/index.html`
- Verify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: GitHub Pages deployment from `main`.
- Produces: public `/EMCOM_2.0/company/` page and verified responsive navigation.

- [ ] **Step 1: Run automated tests fresh**

Run: `npm test`

Expected: all tests PASS with zero failures.

- [ ] **Step 2: Verify locally at control widths**

Use browser widths 1440, 901, 900 and 390 px. Confirm zero horizontal overflow, visible desktop sidebar above 900 px, hidden sidebar at 900 px and below, desktop dropdown above 900 px, and only a direct top-level «О компании» item in the opened mobile menu.

- [ ] **Step 3: Merge the feature branch**

Merge `feature/company-page` into `main` with commit message `Merge company page prototype`.

- [ ] **Step 4: Trigger and verify GitHub Pages**

Confirm deployment succeeds, then repeat the browser checks on `https://kcska18051-crypto.github.io/EMCOM_2.0/company/?verify=20260814-13`.

- [ ] **Step 5: Clean up**

Delete `feature/company-page` only after successful merge and public verification.
