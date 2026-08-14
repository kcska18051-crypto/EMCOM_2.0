# Company Partners Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish an adaptive `/company/partners/` wireframe with two approved card groups and working navigation between the three completed company pages.

**Architecture:** Reuse the existing static company-page shell, shared header/footer, sidebar, and responsive breakpoint. Add one focused partners page plus shared partner-card and mobile subsection-navigation styles; keep all content static, non-interactive, and testable through HTML/CSS assertions.

**Tech Stack:** Static HTML, shared CSS, vanilla JavaScript, Node.js test runner, GitHub Contents API, GitHub Pages.

## Global Constraints

- Use Montserrat and the existing gray wireframe palette.
- Use only Lorem ipsum for content headings, paragraphs, list items, and card captions.
- Do not copy partner names, logos, images, or descriptive text from Aspro.
- Render exactly 3 cards in the first group and 7 cards in the second group.
- Cards are not links and have no interactive behavior.
- At 900 px and below, hide the sidebar and render cards in one column without horizontal overflow.
- Keep the mobile burger one-level; provide subsection links in a separate mobile navigation below the page heading.

---

### Task 1: Add failing partner-page and navigation tests

**Files:**
- Create: `tests/partners.test.mjs`
- Modify: `tests/company.test.mjs`
- Modify: `tests/history.test.mjs`
- Modify: `tests/foundation.test.mjs`

**Interfaces:**
- Consumes: static HTML files and `assets/css/prototype.css`.
- Produces: assertions for `data-partner-group`, `data-partner-card`, `data-partner-logo`, `.company-mobile-nav`, and CSS cache key `20260814-16`.

- [ ] **Step 1: Write the failing page-structure test**

Create `tests/partners.test.mjs` with the existing `fileUrl` and `read` helpers, then add these assertions:

```js
assert.ok(existsSync(fileUrl("company/partners/index.html")));
assert.match(html, /<h1[^>]*>Партнёры<\/h1>/);
assert.equal((html.match(/data-partner-group/g) ?? []).length, 2);
assert.equal((html.match(/data-partner-card/g) ?? []).length, 10);
assert.equal((html.match(/data-partner-logo/g) ?? []).length, 10);
const groupCardCounts = [...html.matchAll(/<div class="partner-grid" data-partner-group>([\s\S]*?)<\/div>/g)]
  .map((match) => (match[1].match(/data-partner-card/g) ?? []).length);
assert.equal(groupCardCounts[0], 3);
assert.equal(groupCardCounts[1], 7);
assert.doesNotMatch(html, /1C-Битрикс|DemoHost|Аспро\.Cloud|Разработчики/);
```

- [ ] **Step 2: Write failing navigation and responsive tests**

Assert that the homepage dropdown links to `company/partners/`, company links to `partners/`, history links to `../partners/`, and the partner page links back to `../` and `../history/`. Assert that all three company pages contain a three-link `.company-mobile-nav`. Assert CSS contains a three-column `.partner-grid`, one-column mobile rule, hidden desktop `.company-mobile-nav`, and visible mobile `.company-mobile-nav`.

- [ ] **Step 3: Update cache-key expectations**

Change shared CSS assertions for `index.html`, `company/index.html`, and `company/history/index.html` from their current values to `20260814-16`; add the relative partner-page expectation `../../assets/css/prototype.css?v=20260814-16`.

- [ ] **Step 4: Run the focused tests and verify RED**

Run:

```powershell
node --test tests\partners.test.mjs tests\company.test.mjs tests\history.test.mjs tests\foundation.test.mjs
```

Expected: FAIL because `company/partners/index.html`, partner links, shared mobile subsection navigation, and cache key `20260814-16` do not exist yet.

---

### Task 2: Implement partner page, cards, and cross-page navigation

**Files:**
- Create: `company/partners/index.html`
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: the existing `.site-header`, `.company-page`, `.company-layout`, `.company-sidebar`, and header JavaScript behavior.
- Produces: `/company/partners/`, `.partners-content`, `.partner-grid`, `.partner-card`, `.partner-logo-placeholder`, and `.company-mobile-nav`.

- [ ] **Step 1: Create the partner page shell**

Create `company/partners/index.html` by reusing the complete company-page header, sidebar, footer, and relative asset paths. Use:

```html
<h1>Партнёры</h1>
<nav class="breadcrumbs" aria-label="Хлебные крошки">
  <a href="../../">Главная</a><span aria-hidden="true">—</span>
  <a href="../">О компании</a><span aria-hidden="true">—</span>
  <span>Партнёры</span>
</nav>
```

Mark `<a class="is-current" href="./" aria-current="page" data-company-side-item>Партнёры</a>` as current in the sidebar. Keep «Сертификаты/лицензии» and «Реквизиты» as inactive spans.

- [ ] **Step 2: Add fish-only content and exact card groups**

Use the following content structure:

```html
<article class="company-content partners-content">
  <section class="partners-intro">
    <h2>Lorem ipsum dolor sit amet</h2>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
    <p>Aenean commodo ligula eget dolor.</p>
    <ul>
      <li>Cum sociis natoque penatibus et magnis dis parturient montes.</li>
      <li>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</li>
      <li>Nulla consequat massa quis enim.</li>
    </ul>
  </section>
  <div class="partner-grid" data-partner-group>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Lorem ipsum</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Dolor sit amet</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Consectetuer adipiscing</p></article>
  </div>
  <h2 class="partners-group-title">Aenean vulputate eleifend tellus</h2>
  <div class="partner-grid" data-partner-group>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Aenean commodo</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Ligula eget dolor</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Aenean massa</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Cum sociis natoque</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Penatibus et magnis</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Dis parturient montes</p></article>
    <article class="partner-card" data-partner-card><span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span><p>Nascetur ridiculus</p></article>
  </div>
</article>
```

Each card must be a non-link `<article class="partner-card" data-partner-card>` with `<span class="partner-logo-placeholder" data-partner-logo aria-hidden="true"></span>` and a fish caption. Use these ten captions in order: `Lorem ipsum`, `Dolor sit amet`, `Consectetuer adipiscing`, `Aenean commodo`, `Ligula eget dolor`, `Aenean massa`, `Cum sociis natoque`, `Penatibus et magnis`, `Dis parturient montes`, `Nascetur ridiculus`.

- [ ] **Step 3: Connect all desktop navigation**

Replace the inactive partner items with links:

Use `<a href="company/partners/">Партнёры</a>` in the homepage dropdown, `<a href="partners/">Партнёры</a>` on the company page, `<a href="../partners/">Партнёры</a>` on the history page, and `<a href="./">Партнёры</a>` on the partner page.

Keep working links for «О компании» and «История компании» with page-relative paths.

- [ ] **Step 4: Replace the single mobile switch with shared subsection navigation**

Place the following components below breadcrumbs.

```html
<!-- /company/ -->
<nav class="company-mobile-nav" aria-label="Подразделы компании">
  <a href="./" aria-current="page">О компании</a>
  <a href="history/">История компании</a>
  <a href="partners/">Партнёры</a>
</nav>

<!-- /company/history/ -->
<nav class="company-mobile-nav" aria-label="Подразделы компании">
  <a href="../">О компании</a>
  <a href="./" aria-current="page">История компании</a>
  <a href="../partners/">Партнёры</a>
</nav>

<!-- /company/partners/ -->
<nav class="company-mobile-nav" aria-label="Подразделы компании">
  <a href="../">О компании</a>
  <a href="../history/">История компании</a>
  <a href="./" aria-current="page">Партнёры</a>
</nav>
```

Remove `.company-mobile-switch` markup from the company page. The burger menu remains unchanged and contains only the existing top-level «О компании» link.

- [ ] **Step 5: Add partner and mobile-navigation CSS**

Add these desktop styles:

```css
.company-mobile-nav { display: none; }
.partners-intro p, .partners-intro li { color: var(--color-muted); font-size: 15px; line-height: 1.7; }
.partner-grid { display: grid; margin-top: 32px; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 30px; }
.partner-card { display: flex; min-height: 192px; flex-direction: column; align-items: center; justify-content: center; padding: 30px; border: 1px solid var(--color-border); }
.partner-logo-placeholder { display: block; width: min(58%, 150px); height: 44px; background: var(--color-placeholder); }
.partner-card p { margin: 22px 0 0; color: var(--color-muted); font-size: 13px; text-align: center; }
.partners-group-title { margin: 48px 0 0; font-size: clamp(26px, 2.4vw, 34px); }
```

At `max-width: 900px`, add:

```css
.company-mobile-nav {
  display: flex;
  margin-top: 22px;
  flex-wrap: wrap;
  gap: 10px 18px;
}
.company-mobile-nav a {
  padding-bottom: 4px;
  color: var(--color-muted);
  font-size: 13px;
}
.company-mobile-nav a[aria-current="page"] {
  border-bottom: 1px solid var(--color-text);
  color: var(--color-text);
  font-weight: 600;
}
.partner-grid {
  grid-template-columns: 1fr;
  gap: 24px;
}
.partner-card {
  min-height: 192px;
}
```

- [ ] **Step 6: Bump shared CSS cache key**

Use `prototype.css?v=20260814-16` in `index.html`, `company/index.html`, `company/history/index.html`, and `company/partners/index.html`.

- [ ] **Step 7: Run focused tests and verify GREEN**

Run the focused command from Task 1. Expected: all focused tests PASS.

- [ ] **Step 8: Run the full suite**

Run:

```powershell
node --test tests\*.test.mjs
```

Expected: all tests PASS with zero failures.

---

### Task 3: Verify responsive behavior and publish

**Files:**
- Test: `company/partners/index.html`
- Test: `company/index.html`
- Test: `company/history/index.html`

**Interfaces:**
- Consumes: the completed static pages and GitHub Pages workflow.
- Produces: a deployed `/company/partners/` deliverable on `main`.

- [ ] **Step 1: Verify the local desktop layout**

At 1440 px, assert through the browser that the sidebar is visible, each partner grid uses three columns, the card counts are 3 and 7, and `document.documentElement.scrollWidth <= innerWidth`.

- [ ] **Step 2: Verify breakpoint behavior**

At 901 px verify the sidebar remains visible and the layout has no overflow. At 900 and 390 px verify the sidebar is hidden, `.company-mobile-nav` is visible, partner grids use one column, all ten gray placeholders are visible when scrolled, and there is no horizontal overflow.

- [ ] **Step 3: Verify page transitions**

Click the mobile links and desktop/sidebar links to confirm direct navigation among `/company/`, `/company/history/`, and `/company/partners/`. Confirm the burger still displays only one top-level «О компании» item and no nested list.

- [ ] **Step 4: Commit changed files to the feature branch**

Upload the implementation and tests to `feature/company-partners` through the GitHub Contents API with commit message `feat: add company partners prototype`.

- [ ] **Step 5: Merge and deploy**

Merge `feature/company-partners` into `main`, trigger the Pages build, and wait for a successful deployment workflow.

- [ ] **Step 6: Verify the public page and clean up**

Repeat card-count, responsive, navigation, asset, and console checks on `https://kcska18051-crypto.github.io/EMCOM_2.0/company/partners/?verify=20260814-16`. After successful verification, delete the merged feature branch and leave the public partner page open as the deliverable.
