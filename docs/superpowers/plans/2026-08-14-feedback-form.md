# Feedback Form Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить после этапов работы адаптивную статичную форму обратной связи по утверждённому референсу.

**Architecture:** Семантическая секция добавляется в `index.html`; вся адаптивная композиция реализуется существующим общим CSS без JavaScript. Тест фиксирует порядок, точные тексты, состав полей и статичность элементов.

**Tech Stack:** HTML5, CSS3, Node.js test runner.

## Global Constraints

- Шрифт Montserrat.
- Только серая стилистика прототипа.
- Форма, кнопка и загрузка файла не выполняют действий.
- Мобильная версия не должна создавать горизонтальную прокрутку.

---

### Task 1: Структура и стили формы

**Files:**
- Modify: `tests/homepage.test.mjs`
- Modify: `tests/foundation.test.mjs`
- Modify: `index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: существующую секцию `.work-stages`.
- Produces: секцию `.feedback` с `data-feedback-field` и адаптивной сеткой.

- [ ] **Step 1: Write the failing test**

Добавить проверку расположения формы после `.work-stages`, пяти полей, точных текстов, статичной зоны загрузки и статичной кнопки.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL, секция `.feedback` отсутствует.

- [ ] **Step 3: Write minimal implementation**

Добавить семантическую разметку формы в `index.html`, десктопную сетку и мобильное перестроение в `assets/css/prototype.css`; обновить cache-busting CSS до `20260814-8`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: 13 tests pass.

- [ ] **Step 5: Verify published page**

Проверить GitHub Pages на ширинах 1440 и 390 пикселей: секция присутствует, мобильная сетка одноколоночная, горизонтального переполнения нет.

