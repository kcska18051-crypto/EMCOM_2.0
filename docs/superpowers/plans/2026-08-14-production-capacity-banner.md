# Production Capacity Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved static «Производственные мощности» image-placeholder banner after the cases block.

**Architecture:** Extend `index.html` with one semantic banner section after the cases load control. Add responsive styles to the existing shared stylesheet and protect exact order, copy, and non-interactive behavior with the existing Node test suite.

**Tech Stack:** Semantic HTML5, CSS, responsive media queries, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- The banner follows the complete cases block, including «Загрузить еще».
- The banner is a wide gray image placeholder with text overlaid on its left side.
- Visible copy is exactly the approved heading, Lorem ipsum subtitle, and «Подробнее».
- «Подробнее» is a non-interactive `<span aria-disabled="true">`.
- No eyebrow, real image, decorative content, or invented copy is added.
- Mobile content stays within the gray banner without horizontal overflow.

---

### Task 1: Banner content and test

**Files:**
- Modify: `tests/homepage.test.mjs`
- Modify: `tests/foundation.test.mjs`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.cases-load-control` and the existing `assertInOrder` helper.
- Produces: `.production-banner`, `.production-banner-content`, and `.production-banner-control`.

- [ ] **Step 1: Write the failing test**

Add a test that verifies `.production-banner` follows `.cases-load-control`, checks the exact heading and subtitle, and requires `<span class="production-banner-control" aria-disabled="true">Подробнее</span>`. Update the stylesheet expectation to `prototype.css?v=20260814-6`.

- [ ] **Step 2: Verify RED**

Run `npm test`. Expected: FAIL because the banner and CSS version are absent.

- [ ] **Step 3: Add minimal markup**

Add the following after the cases section and update the stylesheet URL:

```html
<section class="production-banner media-placeholder" aria-labelledby="production-banner-title">
  <div class="production-banner-content">
    <h2 id="production-banner-title">Производственные мощности</h2>
    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor</p>
    <span class="production-banner-control" aria-disabled="true">Подробнее</span>
  </div>
</section>
```

- [ ] **Step 4: Verify GREEN**

Run `npm test`. Expected: all tests PASS.

### Task 2: Responsive presentation and publication

**Files:**
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: the banner markup and existing container/color/type tokens.
- Produces: a wide desktop banner and a readable mobile banner.

- [ ] **Step 1: Style desktop banner**

Use a 1600 px full-bleed maximum width, gray placeholder background, and a minimum height near 520 px. Constrain the content to the 1200 px inner container and limit copy width to approximately 620 px.

- [ ] **Step 2: Style mobile banner**

At 900 px reduce height and gutters. At 560 px use 20 px inner gutters, a minimum height near 480 px, a 34 px heading, and a full-width static control.

- [ ] **Step 3: Verify locally**

Run `npm test`, then inspect at 1440 px and 390 px. Confirm the banner follows cases, the content remains inside the placeholder, and `scrollWidth === clientWidth`.

- [ ] **Step 4: Publish**

Commit to `feature/production-capacity-banner`, merge into `main`, wait for GitHub Pages, and verify the public page serves CSS version `20260814-6` and the banner heading.
