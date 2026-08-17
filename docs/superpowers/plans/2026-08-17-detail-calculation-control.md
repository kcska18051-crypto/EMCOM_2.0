# Detail Calculation Control Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить на детальную страницу решения визуальную некликабельную кнопку «Получить предварительный расчёт» с корректным мобильным адаптивом.

**Architecture:** Элемент добавляется только в основной контент детальной страницы и представляет собой семантически неактивный `span` внутри flex-контейнера. Десктопное и мобильное положение задаются общим файлом стилей; новая проверка фиксирует текст, отсутствие интерактивности и адаптивные правила.

**Tech Stack:** HTML5, CSS3, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- Текст элемента: `Получить предварительный расчёт`.
- Элемент только визуальный: без `href`, без `button`, без обработчика.
- На десктопе элемент выравнивается справа над первым вводным абзацем.
- На мобильных устройствах до `900px` элемент занимает всю ширину основной колонки.
- Остальное содержимое детальной страницы не изменяется.

---

### Task 1: Зафиксировать визуальный элемент тестом

**Files:**
- Modify: `tests/service-detail.test.mjs`

**Interfaces:**
- Consumes: HTML детальной страницы и `assets/css/styles.css`.
- Produces: регрессионные проверки разметки, неинтерактивности и адаптивных CSS-правил.

- [ ] **Step 1: Write the failing test**

Добавить проверку, которая находит ровно один `span.service-detail-calculation-control` с `aria-disabled="true"`, запрещает ссылку или кнопку с этим текстом и проверяет десктопное правое выравнивание и мобильную ширину `100%`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/service-detail.test.mjs`

Expected: FAIL, потому что визуальный элемент и соответствующие стили ещё отсутствуют.

### Task 2: Добавить минимальную разметку и стили

**Files:**
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Modify: `assets/css/styles.css`

**Interfaces:**
- Consumes: класс `.service-detail-content` существующей детальной страницы.
- Produces: `.service-detail-action` и `.service-detail-calculation-control`.

- [ ] **Step 1: Write minimal implementation**

Перед первым вводным блоком добавить:

```html
<div class="service-detail-action">
  <span class="service-detail-calculation-control" aria-disabled="true">Получить предварительный расчёт</span>
</div>
```

Добавить стили правого выравнивания на десктопе, тёмно-серого фона и белого текста, а в существующем `@media (max-width: 900px)` задать ширину `100%`.

- [ ] **Step 2: Run focused test to verify it passes**

Run: `node --test tests/service-detail.test.mjs`

Expected: PASS.

### Task 3: Обновить кэш стилей и проверить весь прототип

**Files:**
- Modify: все полноценные HTML-страницы, подключающие `assets/css/styles.css`
- Modify: тесты, фиксирующие актуальный CSS cache key

**Interfaces:**
- Consumes: новый ключ `20260817-3`.
- Produces: немедленную загрузку обновлённых стилей на GitHub Pages.

- [ ] **Step 1: Replace cache key**

Заменить `20260817-2` на `20260817-3` во всех полноценных страницах и соответствующих тестах.

- [ ] **Step 2: Run all tests**

Run: `node --test tests/*.test.mjs`

Expected: все тесты PASS без предупреждений.

- [ ] **Step 3: Publish and visually verify**

Загрузить изменения в `feature/detail-calculation-control`, объединить ветку с `main`, затем проверить детальную страницу в десктопном и мобильном размерах.

