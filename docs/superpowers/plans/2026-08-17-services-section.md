# Services Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить страницу пяти услуг и детальную страницу «Предпроектное обследование» на основе согласованных шаблонов раздела «Решения».

**Architecture:** `/services/index.html` переиспользует существующие классы страницы списка решений, а `/services/predproektnoe-obsledovanie/index.html` — классы детальной страницы решения. Навигация обновляется относительными ссылками во всех полноценных страницах; тесты фиксируют структуру, маршруты, отсутствие формы и адаптив.

**Tech Stack:** HTML5, CSS3, JavaScript ES modules, Node.js built-in test runner, GitHub Pages.

## Global Constraints

- На странице списка ровно пять услуг в заданном порядке.
- Только карточка «Предпроектное обследование» ведёт на детальную страницу.
- Детальная страница содержит только рыбный текст и согласованные смысловые блоки.
- Кнопка «Получить предварительный расчёт» визуальная и некликабельная.
- Форма обратной связи на детальной странице отсутствует.
- При ширине до `900px` боковое меню скрывается, карточки идут в одну колонку, кнопка занимает `100%` ширины.
- Пункт «Услуги» работает во всех готовых шапках.

---

### Task 1: Зафиксировать структуру раздела тестами

**Files:**
- Create: `tests/services-section.test.mjs`

**Interfaces:**
- Consumes: будущие маршруты `/services/` и `/services/predproektnoe-obsledovanie/`.
- Produces: проверки списка услуг, детальной страницы, навигации и адаптива.

- [ ] **Step 1: Write the failing tests**

Добавить тесты, которые требуют:

```js
assert.ok(existsSync(fileUrl("services/index.html")));
assert.ok(existsSync(fileUrl("services/predproektnoe-obsledovanie/index.html")));
assert.equal((listing.match(/data-service-card/g) ?? []).length, 5);
assert.equal((listing.match(/<a class="services-page-card" data-service-card/g) ?? []).length, 1);
assert.match(detail, /<h1>Предпроектное обследование<\/h1>/);
assert.equal((detail.match(/data-comparison-row/g) ?? []).length, 3);
assert.equal((detail.match(/Получить предварительный расчёт/g) ?? []).length, 1);
assert.doesNotMatch(detail, /feedback-form|<form/);
```

Также проверить пять элементов бокового меню, активный пункт «Услуги» и ссылки на `/services/` во всех готовых шапках.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/services-section.test.mjs`

Expected: FAIL, потому что `/services/` пока является редиректом, а детальной страницы услуги нет.

### Task 2: Реализовать список и детальную страницу

**Files:**
- Replace: `services/index.html`
- Create: `services/predproektnoe-obsledovanie/index.html`

**Interfaces:**
- Consumes: `.services-page-*`, `.service-detail-*`, `.site-header`, `.site-footer-placeholder` из `assets/css/prototype.css`.
- Produces: два публичных маршрута и ссылку между ними.

- [ ] **Step 1: Build the listing page**

Создать полноценную страницу с заголовком «Услуги», пятью `data-services-side-item` и пятью `data-service-card`. Первую карточку оформить так:

```html
<a class="services-page-card" data-service-card href="./predproektnoe-obsledovanie/">
  <h2>Предпроектное обследование</h2>
</a>
```

Остальные карточки реализовать как `article` без ссылок.

- [ ] **Step 2: Build the detail page**

Создать детальную страницу с хлебными крошками «Главная — Услуги — Предпроектное обследование», пятью элементами бокового меню, рыбными блоками, таблицей из трёх строк и элементом:

```html
<span class="service-detail-calculation-control" aria-disabled="true">Получить предварительный расчёт</span>
```

Не добавлять `<form>` или секцию обратной связи.

- [ ] **Step 3: Run focused tests**

Run: `node --test tests/services-section.test.mjs`

Expected: проверки страниц проходят; навигационные проверки ещё ожидают Task 3.

### Task 3: Связать шапки, обновить кэш и опубликовать

**Files:**
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`
- Modify: `solutions/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Modify: тесты, фиксирующие CSS cache key

**Interfaces:**
- Consumes: `/services/` и новый CSS cache key `20260817-4`.
- Produces: рабочий пункт «Услуги» во всех шапках и принудительную загрузку актуального CSS.

- [ ] **Step 1: Update header links**

Заменить неактивный `href="#"` у пункта «Услуги» на корректный относительный путь к `/services/`. На двух новых страницах добавить `aria-current="page"` только пункту «Услуги».

- [ ] **Step 2: Bump the stylesheet cache key**

Во всех полноценных страницах и соответствующих тестах заменить `20260817-3` на `20260817-4`.

- [ ] **Step 3: Run the complete suite**

Run: `node --test tests/*.test.mjs`

Expected: все тесты PASS без предупреждений.

- [ ] **Step 4: Publish and verify**

Загрузить изменения в `feature/services-section`, объединить с `main`, затем проверить `/services/` и `/services/predproektnoe-obsledovanie/` на десктопной и мобильной ширине без горизонтального переполнения.
