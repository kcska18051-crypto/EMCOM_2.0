# Work Stages Mosaic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved six-banner «Этапы работы» mosaic after the production-capacity banner.

**Architecture:** Extend the semantic homepage with one heading area and six stage cards. Use a 12-column CSS grid for the desktop mosaic, then collapse it to two columns on tablets and one column on phones.

**Tech Stack:** Semantic HTML5, CSS Grid, responsive media queries, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- The block follows the complete production-capacity banner.
- It contains the exact approved heading, Lorem ipsum subtitle, and six stage descriptions.
- It contains exactly six gray banners and no stage 10.
- It contains no real images, buttons, categories, arrows, left-side image, or separate right-side text column.
- Desktop uses the approved mosaic; tablet uses two columns; mobile uses one column without horizontal overflow.

---

### Task 1: Content and regression tests

**Files:**
- Modify: `tests/homepage.test.mjs`
- Modify: `tests/foundation.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.production-banner` and `assertInOrder`.
- Produces: `.work-stages`, `.work-stages-grid`, and six `[data-work-stage]` cards.

- [ ] **Step 1: Write the failing test**

Assert that `.work-stages` follows `.production-banner`, the exact heading and subtitle exist, exactly six `data-work-stage` attributes are present, stages 1–6 appear in order with exact copy, and «Этап 10» is absent. Update the stylesheet expectation to `prototype.css?v=20260814-7`.

- [ ] **Step 2: Verify RED**

Run `npm test`. Expected: FAIL because the block and CSS version are absent.

- [ ] **Step 3: Add semantic markup**

Add a `<section class="work-stages">` containing `.work-stages-heading` and `.work-stages-grid`. Add six `<article class="work-stage-card" data-work-stage>` elements with the exact approved text. Update the CSS URL to `prototype.css?v=20260814-7`.

- [ ] **Step 4: Verify GREEN**

Run `npm test`. Expected: all tests PASS.

### Task 2: Mosaic, responsive behavior, and publication

**Files:**
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: the Task 1 classes and existing 1200 px container and grayscale tokens.
- Produces: a 12-column mosaic, two-column tablet layout, and one-column mobile layout.

- [ ] **Step 1: Add desktop mosaic**

Use a 12-column grid. Cards 1 and 6 span six columns; cards 2–5 span three columns. Use gray backgrounds, bottom-aligned text, consistent gaps, and no decorative elements.

- [ ] **Step 2: Add responsive layouts**

At 900 px make every card span six columns. At 560 px switch the grid to one column and make every card full width.

- [ ] **Step 3: Verify locally**

Run `npm test`; inspect at 1440 px and 390 px; verify six cards, correct order, and `scrollWidth === clientWidth`.

- [ ] **Step 4: Publish**

Commit to `feature/work-stages`, merge into `main`, wait for GitHub Pages, and verify CSS version `20260814-7`, six cards, and the mobile single-column layout on the public page.
