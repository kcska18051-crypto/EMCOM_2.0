# Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить адаптивные страницы списка «База знаний» и детальной статьи, связать их с общей навигацией и опубликовать в GitHub Pages.

**Architecture:** Две статические HTML-страницы используют существующие шапку, подвал, Montserrat, серые медиазаглушки и общий CSS. Новый набор семантических классов `knowledge-*` изолирует сетку статей и боковые категории; единственная интерактивная карточка реализуется обычной ссылкой на детальную страницу.

**Tech Stack:** HTML5, CSS3, существующий JavaScript мобильной шапки, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Заголовок раздела и пункт шапки: «База знаний».
- Список содержит ровно девять карточек «Статья 1»–«Статья 9».
- Карточки содержат только серый прямоугольник и заголовок; даты, рубрики, годы и теги отсутствуют.
- Только «Статья 1» кликабельна и ведёт на `/knowledge/statya-1/`.
- Боковые рыбные категории присутствуют на обеих страницах и неинтерактивны.
- Детальная страница содержит только баннер, хлебные крошки, заголовок, боковые категории, рыбный текст и пустой подвал.
- На мобильных боковой блок располагается над основным контентом; горизонтальное переполнение недопустимо.

---

### Task 1: Контракт раздела и навигации

**Files:**
- Create: `tests/knowledge-base.test.mjs`
- Modify: `package.json` (только если потребуется новый test script; текущий `node --test` достаточен)

**Interfaces:**
- Consumes: существующие HTML-пути и общий шаблон шапки.
- Produces: исполняемый контракт разметки для двух страниц, карточек, боковых категорий и ссылок шапки.

- [ ] **Step 1: Write the failing tests**

Создать `tests/knowledge-base.test.mjs` с чтением файлов через `readFileSync` и проверками:

```js
test("knowledge list contains nine minimal cards and one link", () => {
  const html = read("knowledge/index.html");
  assert.match(html, /<h1>База знаний<\/h1>/);
  assert.equal((html.match(/data-knowledge-card/g) ?? []).length, 9);
  assert.equal((html.match(/data-knowledge-card-link/g) ?? []).length, 1);
  for (let index = 1; index <= 9; index += 1) {
    assert.match(html, new RegExp(`Статья ${index}`));
  }
  assert.doesNotMatch(html, /data-year-filter|data-tag-cloud|<time\b/i);
});

test("knowledge detail keeps only approved article blocks", () => {
  const html = read("knowledge/statya-1/index.html");
  assert.match(html, /data-knowledge-hero/);
  assert.match(html, /<h1>Статья 1<\/h1>/);
  assert.match(html, /Lorem ipsum dolor sit amet/);
  assert.doesNotMatch(html, /<form\b|data-gallery|data-related|data-tag-cloud/i);
});
```

Добавить проверки одинакового количества `data-knowledge-category` на обеих страницах, активного пункта шапки и корректных относительных путей из всех готовых страниц.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`

Expected: FAIL, потому что `knowledge/index.html` и `knowledge/statya-1/index.html` ещё отсутствуют.

- [ ] **Step 3: Commit the test contract**

Зафиксировать тест отдельно сообщением `test: define knowledge base contract`.

---

### Task 2: Страница списка статей

**Files:**
- Create: `knowledge/index.html`
- Modify: `assets/css/prototype.css`
- Test: `tests/knowledge-base.test.mjs`

**Interfaces:**
- Consumes: `.site-header`, `.header-bar`, `.site-nav`, `.breadcrumbs`, `.media-placeholder`, `.site-footer-placeholder` и `assets/js/header.js`.
- Produces: `data-knowledge-list`, `data-knowledge-sidebar`, девять `data-knowledge-card`, одна ссылка `data-knowledge-card-link`.

- [ ] **Step 1: Add the minimal listing markup**

Создать страницу с общей шапкой и структурой:

```html
<main class="knowledge-page" data-knowledge-list>
  <header class="knowledge-heading">
    <nav class="breadcrumbs" aria-label="Хлебные крошки">…</nav>
    <h1>База знаний</h1>
  </header>
  <div class="knowledge-layout">
    <aside class="knowledge-sidebar" data-knowledge-sidebar aria-label="Категории статей">…</aside>
    <section class="knowledge-grid" aria-label="Статьи">
      <a class="knowledge-card" href="statya-1/" data-knowledge-card data-knowledge-card-link>
        <span class="knowledge-card-media media-placeholder" aria-hidden="true"></span>
        <span class="knowledge-card-title">Статья 1</span>
      </a>
      <!-- Статья 2–Статья 9: div без href -->
    </section>
  </div>
</main>
```

Боковые категории оформить неинтерактивными `span data-knowledge-category` с пятью нейтральными рыбными названиями: «Lorem ipsum», «Aenean commodo», «Donec quam felis», «Nulla consequat», «Vivamus elementum».

- [ ] **Step 2: Add desktop listing styles**

В `prototype.css` добавить:

```css
.knowledge-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: 64px; }
.knowledge-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 32px 24px; }
.knowledge-card-media { display: block; aspect-ratio: 4 / 3; min-height: 0; }
.knowledge-card-title { display: block; margin-top: 16px; font-weight: 600; color: var(--ink); }
```

Дополнить рамками и отступами в соответствии с существующими боковыми меню, не добавляя новых цветов.

- [ ] **Step 3: Add responsive listing styles**

При `max-width: 1200px` переключить сетку на две колонки. При `max-width: 900px` сделать `.knowledge-layout` одноколоночным, поставить `.knowledge-sidebar` первой и карточки — по одной в ряд.

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: тест списка проходит; тест детальной страницы всё ещё падает из-за отсутствующего файла.

- [ ] **Step 5: Commit the listing**

Зафиксировать изменения сообщением `feat: add knowledge base listing`.

---

### Task 3: Детальная страница статьи

**Files:**
- Create: `knowledge/statya-1/index.html`
- Modify: `assets/css/prototype.css`
- Test: `tests/knowledge-base.test.mjs`

**Interfaces:**
- Consumes: набор боковых категорий и `knowledge-*` layout из Task 2.
- Produces: `data-knowledge-detail`, `data-knowledge-hero`, `data-knowledge-article` и обратную ссылку в хлебных крошках.

- [ ] **Step 1: Add the approved detail markup**

Создать страницу со следующей областью:

```html
<main class="knowledge-detail-page" data-knowledge-detail>
  <section class="knowledge-detail-intro">
    <div class="knowledge-detail-hero media-placeholder" data-knowledge-hero aria-label="Место для изображения"></div>
    <header class="knowledge-heading">
      <nav class="breadcrumbs" aria-label="Хлебные крошки">…</nav>
      <h1>Статья 1</h1>
    </header>
  </section>
  <div class="knowledge-layout">
    <aside class="knowledge-sidebar" data-knowledge-sidebar>…</aside>
    <article class="knowledge-article" data-knowledge-article>
      <p class="knowledge-lead">Lorem ipsum dolor sit amet…</p>
      <p>Lorem ipsum dolor sit amet…</p>
      <p>Lorem ipsum dolor sit amet…</p>
    </article>
  </div>
</main>
```

Не добавлять формы, даты, галерею, теги, похожие материалы или кнопки.

- [ ] **Step 2: Add detail styles**

Задать широкому баннеру пропорцию, соответствующую существующим детальным страницам, а текстовой колонке — читаемую ширину и межабзацные интервалы. Переиспользовать мобильное одноколоночное правило `.knowledge-layout`.

- [ ] **Step 3: Run tests**

Run: `npm test`

Expected: новые тесты структуры списка и детальной страницы проходят; навигационный тест может ещё падать до Task 4.

- [ ] **Step 4: Commit the detail page**

Зафиксировать изменения сообщением `feat: add knowledge article detail`.

---

### Task 4: Сквозная навигация и cache key

**Files:**
- Modify: `index.html`
- Modify: `company/index.html`, `company/history/index.html`, `company/partners/index.html`, `company/licenses/index.html`
- Modify: `solutions/index.html`, `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/index.html`, `solutions/avtonomnoe-i-rezervnoe-elektrosnabzhenie/dizelnye-elektrostantsii/index.html`
- Modify: `services/index.html`, `services/predproektnoe-obsledovanie/index.html`
- Modify: `cases/index.html`, `cases/proekt-1/index.html`
- Modify: `production/index.html`
- Modify: `knowledge/index.html`, `knowledge/statya-1/index.html`
- Test: `tests/knowledge-base.test.mjs` and existing tests containing CSS cache assertions

**Interfaces:**
- Consumes: `/knowledge/` and existing relative-path conventions.
- Produces: рабочую ссылку «База знаний» во всех шапках и единый новый CSS cache key.

- [ ] **Step 1: Replace placeholder links**

Заменить `<a class="nav-link" href="#">База знаний</a>` на ссылки к `/knowledge/` с глубиной пути, соответствующей каждому HTML-файлу. На двух новых страницах добавить `aria-current="page"`.

- [ ] **Step 2: Refresh the CSS cache key**

Обновить все подключения `prototype.css?v=…` на единый новый ключ `20260817-8`; скорректировать точные ожидания cache key в существующих тестах.

- [ ] **Step 3: Run the complete suite**

Run: `npm test`

Expected: PASS для всех существующих и новых тестов.

- [ ] **Step 4: Commit navigation changes**

Зафиксировать изменения сообщением `feat: connect knowledge base navigation`.

---

### Task 5: Публикация и визуальная проверка

**Files:**
- Verify only: all modified files from Tasks 1–4.

**Interfaces:**
- Consumes: полностью прошедшую тестовую сборку.
- Produces: опубликованные `/knowledge/` и `/knowledge/statya-1/` на GitHub Pages.

- [ ] **Step 1: Verify repository diff and tests**

Проверить, что изменения ограничены согласованным разделом, общими ссылками шапки и cache key. Повторно выполнить `npm test`; ожидается нулевой код возврата.

- [ ] **Step 2: Publish through a feature branch and merge into main**

Создать ветку от актуального `main`, загрузить точный набор изменённых файлов, слить ветку через GitHub API и удалить только успешно слитую удалённую ветку.

- [ ] **Step 3: Verify GitHub Pages on desktop**

Открыть `/knowledge/?verify=<cache-buster>`, проверить девять карточек, левую колонку, активную навигацию и переход по «Статья 1».

- [ ] **Step 4: Verify GitHub Pages on mobile**

На мобильной ширине проверить бургер-меню, расположение категорий над контентом, одноколоночные карточки и отсутствие горизонтального переполнения на обеих страницах.

- [ ] **Step 5: Finalize browser state**

Вернуть viewport к стандартному размеру, оставить открытой актуальную опубликованную страницу и закрыть лишние вкладки.
