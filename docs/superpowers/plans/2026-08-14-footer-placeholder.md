# Footer Placeholder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Визуально заложить пустое место под будущий подвал сайта.

**Architecture:** Семантический `footer` располагается после `main`. Единственный CSS-класс задаёт тёмно-серый фон и адаптивную высоту; содержимого и интерактивности нет.

**Tech Stack:** HTML5, CSS3, Node.js test runner.

## Global Constraints

- Подвал не содержит видимых текстов и элементов.
- Подвал следует сразу после основного содержимого и формы обратной связи.
- Десктопная минимальная высота — 360 пикселей; мобильная — 240 пикселей.

---

### Task 1: Пустой визуальный подвал

**Files:**
- Modify: `tests/homepage.test.mjs`
- Modify: `tests/foundation.test.mjs`
- Modify: `index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: завершение секции `.feedback`.
- Produces: пустой `.site-footer-placeholder` после `main`.

- [ ] **Step 1: Write the failing test**

Проверить, что пустой `footer` следует после формы и имеет соответствующие CSS-высоты.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `.site-footer-placeholder` is absent.

- [ ] **Step 3: Write minimal implementation**

Добавить пустой `footer`, десктопную и мобильную высоты; обновить cache-busting CSS до `20260814-9`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: 14 tests pass.

- [ ] **Step 5: Publish and verify**

Объединить feature-ветку с `main`, дождаться GitHub Pages и проверить наличие подвала на публичной странице.

