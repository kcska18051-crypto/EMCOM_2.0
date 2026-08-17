# Solutions Hierarchy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перенести ошибочно названный раздел «Услуги» в «Решения», добавить промежуточную страницу с тремя типами установок и переиспользовать текущую детальную страницу для «Дизельных электростанций».

**Architecture:** Статические страницы размещаются в новой иерархии `solutions/`. Старые страницы `services/` становятся минимальными HTML-перенаправлениями. Существующая общая таблица стилей расширяется классами второго уровня, а все созданные шапки получают единую ссылку на «Решения».

**Tech Stack:** HTML5, CSS3, JavaScript существующей шапки, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Использовать точное название «Автономное и резервное электроснабжение».
- Первый уровень содержит восемь существующих решений.
- Второй уровень содержит ровно три карточки: «Дизельные электростанции», «Газопоршневые установки», «Газотурбинные установки».
- Содержимое текущей детальной страницы сохраняется, кроме заголовка, хлебных крошек, шапки и относительных путей.
- Старые URL перенаправляются на новые.
- До 900 px боковое меню скрывается, карточки второго уровня идут одной колонкой.

---

### Task 1: Проверки новой иерархии

**Files:**
- Create: `tests/solutions-hierarchy.test.mjs`
- Modify: `tests/services-page.test.mjs`
- Modify: `tests/service-detail.test.mjs`

**Interfaces:**
- Consumes: спецификацию URL и названий.
- Produces: проверки структуры, ссылок, перенаправлений и адаптива.

- [ ] **Step 1: Write the failing tests**

```js
test("solutions hierarchy has three levels", () => {
  const listing = read("solutions/index.html");
  const group = read("solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html");
  const detail = read("solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html");
  assert.match(listing, /<h1>Решения<\/h1>/);
  assert.equal((group.match(/data-solution-child-card/g) ?? []).length, 3);
  assert.match(detail, /<h1>Дизельные электростанции<\/h1>/);
});
```

- [ ] **Step 2: Run tests to verify RED**

Run: `node --test tests/solutions-hierarchy.test.mjs`

Expected: FAIL because `solutions/index.html` does not exist.

### Task 2: Первый и второй уровни решений

**Files:**
- Create: `solutions/index.html`
- Create: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: existing `.services-page-*` visual primitives.
- Produces: eight-card listing and three-card child listing using `.solution-level-*` classes.

- [ ] **Step 1: Create the first level**

Copy the approved eight-card composition, change document heading and breadcrumbs to «Решения», make the first card link to `./avtonomnoe-i-rezervnoe-elektrosnabzhenie/`, and mark the header «Решения» link current.

- [ ] **Step 2: Create the second level**

Add semantic elements with these stable hooks:

```html
<aside class="solution-level-sidebar">
  <section class="solution-level-group is-open">
    <h2>Автономное и резервное электроснабжение</h2>
    <a href="./dizelnye-elektrostantsii/">Дизельные электростанции</a>
    <span>Газопоршневые установки</span>
    <span>Газотурбинные установки</span>
  </section>
</aside>
<div class="solution-level-grid">
  <a class="solution-level-card" data-solution-child-card href="./dizelnye-elektrostantsii/"><h2>Дизельные электростанции</h2></a>
  <article class="solution-level-card" data-solution-child-card><h2>Газопоршневые установки</h2></article>
  <article class="solution-level-card" data-solution-child-card><h2>Газотурбинные установки</h2></article>
</div>
```

- [ ] **Step 3: Add responsive CSS**

```css
.solution-level-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
@media (max-width: 900px) {
  .solution-level-sidebar { display: none; }
  .solution-level-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run focused tests**

Run: `node --test tests/solutions-hierarchy.test.mjs`

Expected: first- and second-level assertions PASS; detail and redirects still FAIL.

### Task 3: Детальная страница и перенаправления

**Files:**
- Create: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Replace: `services/index.html`
- Replace: `services/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`

**Interfaces:**
- Consumes: current detail-page composition and new hierarchy.
- Produces: diesel detail URL and two backward-compatible redirect pages.

- [ ] **Step 1: Reuse the detail composition**

Change `title` and `h1` to «Дизельные электростанции», render the four-level breadcrumbs, activate «Решения», and adjust all paths to the new depth. Keep description, capabilities, comparison rows and «Дополнительно» unchanged.

- [ ] **Step 2: Add redirect documents**

Each old page uses the corresponding target:

```html
<meta http-equiv="refresh" content="0; url=../solutions/">
<link rel="canonical" href="../solutions/">
<p><a href="../solutions/">Перейти в раздел «Решения»</a></p>
```

The nested redirect uses `../../solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/`.

- [ ] **Step 3: Run focused tests**

Run: `node --test tests/solutions-hierarchy.test.mjs`

Expected: PASS.

### Task 4: Общая шапка и регрессия

**Files:**
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`
- Modify: existing tests that assert header URLs and CSS cache key.

**Interfaces:**
- Consumes: `/solutions/` route.
- Produces: consistent «Решения» link across all completed pages; «Услуги» remains inactive.

- [ ] **Step 1: Update all completed headers**

For each page, set the relative `href` of «Решения» to the new section and set the «Услуги» link to `#` without `aria-current`.

- [ ] **Step 2: Bump the shared CSS cache key**

Set every non-redirect page to `prototype.css?v=20260817-1` and update matching assertions.

- [ ] **Step 3: Run the complete suite**

Run: `npm test`

Expected: all tests PASS with zero failures.

### Task 5: Публикация и визуальная проверка

**Files:**
- Publish all changed files on `feature/solutions-hierarchy`.

**Interfaces:**
- Consumes: verified local static files.
- Produces: merged GitHub Pages deployment.

- [ ] **Step 1: Upload and merge**

Upload changed files to `feature/solutions-hierarchy`, merge the branch into `main`, then remove the feature branch.

- [ ] **Step 2: Verify public desktop layout**

At 1440 px, confirm three child cards in one row, expanded desktop sidebar, correct breadcrumbs, and no horizontal overflow.

- [ ] **Step 3: Verify public mobile layout**

At 390 px, confirm hidden sidebar, one-column cards, working burger, readable breadcrumbs, and no horizontal overflow.

- [ ] **Step 4: Verify navigation chain**

Click «Решения» → «Автономное и резервное электроснабжение» → «Дизельные электростанции» and confirm the three expected URLs.
