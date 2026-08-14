# Responsive Header Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перестроить шапку в одну десктопную строку и добавить корректное мобильное меню по логике Aspro.

**Architecture:** `index.html` получает общую строку `.header-bar`, бургер и CTA внутри навигации. CSS переключает горизонтальную и вертикальную композиции на 900 пикселях; `header.js` управляет классом `.is-open` и ARIA-состоянием.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Node.js test runner.

## Global Constraints

- Десктопная шапка — одна строка.
- Мобильная шапка — 62 пикселя, бургер и логотип.
- Все семь разделов и «Форма обратной связи» доступны в мобильном меню.
- Горизонтальная прокрутка отсутствует.

---

### Task 1: Разметка, стили и поведение шапки

**Files:**
- Modify: `tests/foundation.test.mjs`
- Modify: `tests/homepage.test.mjs`
- Modify: `index.html`
- Modify: `assets/css/prototype.css`
- Modify: `assets/js/header.js`

**Interfaces:**
- Consumes: `setMenuState(button, menu, expanded)` для списка «О компании».
- Produces: `setMobileMenuState(button, menu, expanded)` и `.site-nav.is-open`.

- [ ] **Step 1: Write the failing tests**

Зафиксировать общий `.header-bar`, бургер, CTA, версии ассетов, мобильные CSS-правила и синхронизацию состояния меню.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL because the new header structure and helper are absent.

- [ ] **Step 3: Implement the header**

Перестроить HTML, добавить адаптивный CSS и `setMobileMenuState`; обновить CSS до `20260814-11`, JS до `20260814-3`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: all 17 tests pass.

- [ ] **Step 5: Browser verification**

На 1440 пикселях проверить одну строку; на 390 пикселях — высоту 62 пикселя, скрытую/открытую панель и отсутствие горизонтального переполнения.

