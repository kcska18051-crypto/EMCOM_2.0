# Company History Prototype Implementation Plan

**Goal:** Add an adaptive `/company/history/` wireframe based on the approved Aspro layout, using fish text and gray image placeholders, then connect navigation from the homepage and company page.

**Architecture:** Reuse the existing static HTML header, company sidebar, footer, shared CSS, and header JavaScript. The history timeline is semantic HTML with four entries and optional image placeholders. Desktop uses the existing sidebar plus a multi-column timeline; mobile hides the sidebar and stacks each timeline entry.

**Tech Stack:** Static HTML, shared CSS, vanilla JavaScript, Node.js test runner, GitHub Pages.

---

## Task 1: Add red tests for the history page and navigation

**Files:**
- Create: `work/EMCOM_2.0/tests/history.test.mjs`
- Modify: `work/EMCOM_2.0/tests/company.test.mjs`

1. Assert that `/company/history/index.html` exists, contains the page title, four ordered years, two gray image placeholders, the approved periods, fish text, and an active history sidebar item.
2. Assert that the company page and desktop dropdown link to `history/`, while the history page links back to `/company/`.
3. Assert that shared CSS contains desktop, intermediate, and mobile timeline rules.
4. Run the focused tests and confirm they fail because the history page and links do not exist yet.

## Task 2: Implement the page and responsive styling

**Files:**
- Create: `work/EMCOM_2.0/company/history/index.html`
- Modify: `work/EMCOM_2.0/company/index.html`
- Modify: `work/EMCOM_2.0/index.html`
- Modify: `work/EMCOM_2.0/assets/css/prototype.css`
- Modify: `work/EMCOM_2.0/tests/foundation.test.mjs`

1. Reuse the existing responsive header, one-level mobile burger, company sidebar, and footer.
2. Add the history title, fish-text introduction, and four timeline entries for 2009, 2012, 2015, and 2020.
3. Add periods only for 2009 and 2012, and gray image placeholders only for 2009 and 2015.
4. Connect desktop dropdown and sidebar navigation between `/company/` and `/company/history/`; keep mobile “О компании” as a direct one-level link.
5. Add responsive CSS: full three-column layout at wide desktop, safe two-column layout at intermediate desktop, and stacked cards with square image placeholders at 900 px and below.
6. Bump the shared CSS cache key to `20260814-14` in all pages and update the foundation expectation.
7. Run the focused tests, then the complete suite, and confirm all pass.

## Task 3: Verify, publish, and expose the deliverable

1. Check the local page at 1440, 901, 900, and 390 px for no horizontal overflow and correct sidebar/burger behavior.
2. Commit changed files to `feature/company-history` through the GitHub Contents API.
3. Merge the feature branch into `main`, trigger GitHub Pages, and wait for deployment.
4. Verify the public `/company/history/` page, links, responsive behavior, and browser console.
5. Open the deployed history page in the in-app browser and remove the merged feature branch.
