# Homepage Cases Block Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved non-interactive «Кейсы» wireframe block after the about-company section.

**Architecture:** Extend the semantic homepage HTML with one self-contained cases section and extend the shared responsive stylesheet with desktop and mobile layouts. Preserve the existing static-site structure and validate content, order, and non-interactive controls through Node tests.

**Tech Stack:** Semantic HTML5, CSS Grid, responsive CSS media queries, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- The block follows the complete `about-company` section and its gray media placeholder.
- Visible copy is exactly the approved Russian and Lorem ipsum text.
- «Все проекты» and «Загрузить еще» are rendered as non-interactive visual controls.
- Exactly three gray horizontal project banners are shown in the order «Проект 1», «Проект 2», «Проект 3».
- Desktop uses a left copy column and a right banner column; mobile stacks all content in one column.
- No project images, arrows, categories, extra captions, or invented content are added.
- Horizontal overflow is not allowed.

---

### Task 1: Cases content and regression test

**Files:**
- Modify: `tests/homepage.test.mjs`
- Modify: `tests/foundation.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: the existing `.about-company` section and `assertInOrder` test helper.
- Produces: `.cases`, `[data-case-card]`, `.cases-all-control`, and `.cases-load-control` markup for styling and verification.

- [ ] **Step 1: Write the failing test**

Add a test that asserts `.cases` follows `.about-company`, verifies the exact heading and subtitle, counts three `data-case-card` elements, checks the project title order, and verifies both controls use non-interactive `<span>` elements. Update the stylesheet version expectation to `prototype.css?v=20260814-5`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: FAIL because `.cases` and stylesheet version `20260814-5` are absent.

- [ ] **Step 3: Write minimal semantic markup**

Add after `</section>` for `.about-company`:

```html
<section class="cases" aria-labelledby="cases-title">
  <div class="cases-copy">
    <h2 id="cases-title">Кейсы</h2>
    <p>...</p>
    <span class="cases-all-control" aria-disabled="true">Все проекты</span>
  </div>
  <div class="cases-list">
    <article class="case-card" data-case-card><h3>Проект 1</h3></article>
    <article class="case-card" data-case-card><h3>Проект 2</h3></article>
    <article class="case-card" data-case-card><h3>Проект 3</h3></article>
    <span class="cases-load-control" aria-disabled="true">Загрузить еще</span>
  </div>
</section>
```

Set the stylesheet URL to `assets/css/prototype.css?v=20260814-5`.

- [ ] **Step 4: Run the tests and verify content passes**

Run: `npm test`

Expected: all tests PASS.

### Task 2: Responsive cases layout and visual verification

**Files:**
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: the cases classes created in Task 1 and existing `--container`, color, border, and typography tokens.
- Produces: a two-column desktop composition and a single-column mobile composition.

- [ ] **Step 1: Add desktop layout**

Style `.cases` as a 1200 px container grid with a restrained left column and flexible right column. Style `.case-card` as a wide gray `16 / 5` placeholder with the heading aligned to the lower left. Render both control spans with bordered button styling and no pointer cursor.

- [ ] **Step 2: Add responsive layout**

At `max-width: 900px`, stack `.cases` into one column and use a wider banner ratio. At `max-width: 560px`, keep a single column, use `16 / 9` banners, and preserve 20 px page gutters.

- [ ] **Step 3: Run automated verification**

Run: `npm test`

Expected: all tests PASS with no warnings.

- [ ] **Step 4: Verify in a browser**

At 1440 px verify two columns, three banners, and the load control below the third banner. At 390 px verify one column, three banners, readable controls, and `scrollWidth === clientWidth`.

- [ ] **Step 5: Publish and verify GitHub Pages**

Commit the changed files to `feature/homepage-cases`, merge that branch into `main`, wait for the Pages build to use the merged commit, and verify the public URL serves CSS version `20260814-5` and all three project cards.
