# Production Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить адаптивную страницу `/production/` по образцу детальной страницы услуги и связать её с пунктом «Производство» во всех готовых шапках.

**Architecture:** Страница переиспользует существующие классы `service-detail-*`, общую шапку, мобильное меню и визуальный подвал. Специальная логика и новые интерактивные компоненты не создаются; кнопка остаётся семантически неактивным `span`.

**Tech Stack:** статический HTML5, общий CSS `assets/css/prototype.css`, ES-модуль `assets/js/header.js`, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Адрес страницы: `/production/`.
- Заголовок и конечная хлебная крошка: «Производство».
- Боковое меню содержит ровно пять рыбных пунктов.
- Основной контент использует только рыбный текст.
- Кнопка «Получить предварительный расчёт» визуальная и некликабельная.
- Формы, таблицы, фотогалереи, карточки и дополнительные секции не добавляются.
- Мобильная версия не создаёт горизонтального переполнения.
- Изменения публикуются через ветку `feature/production-page` и после проверки объединяются с `main`.

---

### Task 1: Зафиксировать структуру страницы тестами

**Files:**
- Create: `tests/production-page.test.mjs`
- Test: `tests/production-page.test.mjs`

**Interfaces:**
- Consumes: файловая структура статического сайта и HTML-атрибуты `data-production-*`.
- Produces: контракт для страницы, навигации и адаптивного переиспользования существующих классов.

- [ ] **Step 1: Write the failing test**

Создать тест, который читает `production/index.html` и проверяет:

```js
assert.match(html, /<h1>Производство<\/h1>/);
assert.match(html, /Главная[\s\S]*Производство/);
assert.equal((html.match(/data-production-side-item/g) ?? []).length, 5);
assert.equal((html.match(/data-production-calculation-control/g) ?? []).length, 1);
assert.match(html, /Получить предварительный расчёт/);
assert.match(html, /Lorem ipsum dolor sit amet/);
assert.doesNotMatch(html, /<form\b/i);
assert.doesNotMatch(html, /<table\b/i);
```

Добавить проверку порядка `hero → heading → layout → footer`, активного пункта «Производство» и использования классов `service-detail-page`, `service-detail-layout`, `service-detail-sidebar`, `service-detail-content`.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/production-page.test.mjs`

Expected: FAIL, потому что `production/index.html` ещё не существует.

- [ ] **Step 3: Add navigation assertions**

В том же тесте перечислить готовые страницы и ожидаемые относительные ссылки:

```js
const headers = new Map([
  ["index.html", "production/"],
  ["company/index.html", "../production/"],
  ["company/history/index.html", "../../production/"],
  ["company/partners/index.html", "../../production/"],
  ["company/licenses/index.html", "../../production/"],
  ["solutions/index.html", "../production/"],
  ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html", "../../production/"],
  ["solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html", "../../../production/"],
  ["services/index.html", "../production/"],
  ["services/predproektnoe-obsledovanie/index.html", "../../production/"],
  ["cases/index.html", "../production/"],
  ["cases/proekt-1/index.html", "../../production/"]
]);
```

Для каждого файла проверить ссылку с текстом «Производство».

- [ ] **Step 4: Run test and retain the expected RED state**

Run: `node --test tests/production-page.test.mjs`

Expected: FAIL по отсутствующей странице и неактивным ссылкам `href="#"`.

---

### Task 2: Создать страницу «Производство»

**Files:**
- Create: `production/index.html`
- Reuse: `assets/css/prototype.css`
- Reuse: `assets/js/header.js`
- Test: `tests/production-page.test.mjs`

**Interfaces:**
- Consumes: классы `service-detail-*`, `services-page-sidebar`, `media-placeholder`, `site-footer-placeholder`.
- Produces: публичную страницу `/production/` и стабильные атрибуты `data-production-hero`, `data-production-side-item`, `data-production-calculation-control`, `data-production-description`.

- [ ] **Step 1: Create the shared shell and hero**

Создать HTML с корректными относительными путями `../assets/...`, общей шапкой и началом страницы:

```html
<main class="service-detail-page production-page">
  <section class="service-detail-intro">
    <div class="service-detail-hero media-placeholder" data-production-hero aria-label="Место для изображения"></div>
    <header class="service-detail-heading">
      <nav class="breadcrumbs" aria-label="Хлебные крошки">
        <a href="../">Главная</a><span aria-hidden="true">—</span><span>Производство</span>
      </nav>
      <h1>Производство</h1>
    </header>
  </section>
```

- [ ] **Step 2: Add the approved two-column content**

Добавить пять нейтральных рыбных пунктов и правую колонку:

```html
<div class="service-detail-layout">
  <aside class="services-page-sidebar service-detail-sidebar" aria-label="Разделы производства">
    <span class="is-current" data-production-side-item>Lorem ipsum dolor</span>
    <span data-production-side-item>Aenean commodo</span>
    <span data-production-side-item>Donec quam felis</span>
    <span data-production-side-item>Nulla consequat</span>
    <span data-production-side-item>Vivamus elementum</span>
  </aside>
  <article class="service-detail-content">
    <div class="service-detail-action">
      <span class="service-detail-calculation-control" data-production-calculation-control aria-disabled="true">Получить предварительный расчёт</span>
    </div>
    <section class="service-detail-description" data-production-description>
      <p class="service-detail-lead">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</p>
    </section>
  </article>
</div>
```

Закрыть `main`, добавить пустой `site-footer-placeholder` и подключить `../assets/js/header.js?v=20260814-3`.

- [ ] **Step 3: Run the structural test**

Run: `node --test tests/production-page.test.mjs`

Expected: часть тестов проходит; проверки ссылок старых страниц ещё падают.

- [ ] **Step 4: Commit the page slice**

Загрузить `production/index.html` и `tests/production-page.test.mjs` в `feature/production-page` через GitHub Contents API с сообщением `feat: add production page`.

---

### Task 3: Связать «Производство» со всеми готовыми страницами

**Files:**
- Modify: `index.html`
- Modify: `company/index.html`
- Modify: `company/history/index.html`
- Modify: `company/partners/index.html`
- Modify: `company/licenses/index.html`
- Modify: `solutions/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`
- Modify: `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Modify: `services/index.html`
- Modify: `services/predproektnoe-obsledovanie/index.html`
- Modify: `cases/index.html`
- Modify: `cases/proekt-1/index.html`
- Modify: `production/index.html`
- Test: `tests/production-page.test.mjs`

**Interfaces:**
- Consumes: относительные пути из карты теста Task 1.
- Produces: единый рабочий пункт основной навигации «Производство».

- [ ] **Step 1: Replace placeholder links**

В каждом готовом HTML заменить только ссылку пункта «Производство» с `href="#"` на путь из карты теста. На `production/index.html` использовать:

```html
<a class="nav-link" href="./" aria-current="page">Производство</a>
```

- [ ] **Step 2: Run the focused test**

Run: `node --test tests/production-page.test.mjs`

Expected: PASS со всеми проверками страницы и ссылок.

- [ ] **Step 3: Run the full regression suite**

Run: `node --test tests/*.test.mjs`

Expected: все тесты PASS, включая новый набор; 0 failures.

- [ ] **Step 4: Commit the navigation slice**

Загрузить изменённые HTML-файлы и финальный тест в `feature/production-page` через GitHub Contents API с сообщением `feat: link production navigation`.

---

### Task 4: Опубликовать и визуально проверить

**Files:**
- Verify: `production/index.html`
- Verify: все файлы `tests/*.test.mjs`

**Interfaces:**
- Consumes: полностью проверенную ветку `feature/production-page`.
- Produces: опубликованный раздел на GitHub Pages из `main`.

- [ ] **Step 1: Verify the remote feature branch**

Клонировать `feature/production-page` во временную директорию и выполнить:

```powershell
node --test tests/*.test.mjs
```

Expected: 0 failures.

- [ ] **Step 2: Merge into main**

Объединить `feature/production-page` с `main` через GitHub Merge API с сообщением `feat: add production page`.

- [ ] **Step 3: Verify merged main**

Клонировать свежий `main` во временную директорию и повторно выполнить `node --test tests/*.test.mjs`.

Expected: 0 failures, SHA соответствует результату слияния.

- [ ] **Step 4: Verify GitHub Pages desktop**

Открыть `https://kcska18051-crypto.github.io/EMCOM_2.0/production/` при ширине 1440 px и проверить:

- серый баннер, хлебные крошки и `h1`;
- две колонки;
- пять пунктов бокового меню;
- одну некликабельную кнопку;
- рыбный текст и отсутствие формы;
- активный пункт «Производство»;
- отсутствие горизонтального переполнения.

- [ ] **Step 5: Verify GitHub Pages mobile**

При ширине 390 px проверить бургер, одноколоночную композицию, полную ширину кнопки и отсутствие горизонтального переполнения.

- [ ] **Step 6: Clean up merged branch**

После успешных проверок удалить только удалённую ветку `feature/production-page`. Локальные пользовательские файлы и временные каталоги не удалять.
