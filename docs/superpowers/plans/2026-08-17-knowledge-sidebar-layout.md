# Knowledge Sidebar Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перенести меню статей в правую колонку на странице списка и рядом с баннером на детальной странице, удалив прежнее левое меню рядом с текстом.

**Architecture:** Обе страницы используют общий компонент разметки `knowledge-article-menu` из девяти неинтерактивных `span`. Список строится как «карточки слева — меню справа», детальная страница — как «баннер слева — меню справа» с заголовком и текстом под баннером.

**Tech Stack:** HTML5, CSS3, Node.js `node:test`, существующий JavaScript мобильной шапки, GitHub Pages.

## Global Constraints

- Меню содержит ровно девять пунктов «Статья 1»–«Статья 9».
- Все пункты меню неинтерактивны; ссылки и кнопки внутри меню отсутствуют.
- «Статья 1» имеет активное визуальное состояние на обеих страницах.
- Прежнее левое меню рядом с текстом детальной статьи удаляется.
- На мобильном меню списка идёт после карточек; меню детальной страницы — после баннера и перед заголовком с текстом.

---

### Task 1: Обновить тестовый контракт

**Files:**
- Modify: `tests/knowledge-base.test.mjs`

**Interfaces:**
- Consumes: существующие `data-knowledge-card`, `data-knowledge-hero`, `data-knowledge-article`.
- Produces: контракт `data-knowledge-article-menu`, девять `data-knowledge-menu-item` и один `aria-current="page"`.

- [ ] **Step 1: Write failing tests**

Добавить проверки:

```js
for (const path of ["knowledge/index.html", "knowledge/statya-1/index.html"]) {
  const html = read(path);
  assert.equal((html.match(/data-knowledge-menu-item/g) ?? []).length, 9);
  assert.equal((html.match(/data-knowledge-menu-item[^>]*aria-current="page"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /data-knowledge-category/);
}
```

Проверить порядок DOM: на списке сетка предшествует меню; на детальной странице баннер предшествует меню, меню — заголовку и статье.

- [ ] **Step 2: Run red test**

Run: `node --test tests/knowledge-base.test.mjs`

Expected: FAIL из-за отсутствующих `data-knowledge-menu-item` и старых категорий.

---

### Task 2: Перестроить обе страницы и адаптив

**Files:**
- Modify: `knowledge/index.html`
- Modify: `knowledge/statya-1/index.html`
- Modify: `assets/css/prototype.css`
- Test: `tests/knowledge-base.test.mjs`

**Interfaces:**
- Consumes: общий контейнер, медиазаглушки и стили шапки.
- Produces: `.knowledge-list-layout`, `.knowledge-detail-top`, `.knowledge-article-menu`, `.knowledge-detail-body`.

- [ ] **Step 1: Replace both old sidebars**

Использовать одинаковое меню:

```html
<aside class="knowledge-article-menu" data-knowledge-article-menu aria-label="Статьи">
  <span data-knowledge-menu-item aria-current="page">Статья 1</span>
  <span data-knowledge-menu-item>Статья 2</span>
  <!-- Статья 3–Статья 9 -->
</aside>
```

На списке разместить меню после `.knowledge-grid`. На детальной странице разместить после `data-knowledge-hero`, а заголовок и `data-knowledge-article` — после `.knowledge-detail-top` в левой ширине баннера.

- [ ] **Step 2: Replace layout CSS**

Задать:

```css
.knowledge-list-layout,
.knowledge-detail-top { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 48px; }
.knowledge-article-menu span { display: flex; min-height: 62px; border-bottom: 1px solid var(--color-border); }
.knowledge-article-menu span[aria-current="page"] { color: var(--color-text); font-weight: 600; }
.knowledge-detail-body { width: calc(100% - 328px); }
```

Удалить правила `.knowledge-sidebar` и старое двухколоночное расположение текста.

- [ ] **Step 3: Add mobile source-order layouts**

При `max-width: 900px` обе сетки переводятся в одну колонку. `.knowledge-list-layout` сохраняет порядок «карточки — меню», `.knowledge-detail-top` — «баннер — меню», `.knowledge-detail-body` занимает 100% ширины.

- [ ] **Step 4: Refresh cache key and tests**

Обновить общий CSS cache key на `20260817-9` во всех HTML и точных тестовых ожиданиях.

- [ ] **Step 5: Run full suite**

Run: `npm test`

Expected: все тесты PASS.

---

### Task 3: Публикация и визуальная проверка

**Files:**
- Verify: все изменённые файлы Tasks 1–2.

**Interfaces:**
- Consumes: зелёный тестовый набор.
- Produces: обновлённый GitHub Pages в `main`.

- [ ] **Step 1: Publish from an isolated feature branch**

Создать feature-ветку от ветки спецификации, загрузить точный набор файлов, объединить с `main` и удалить только слитые временные ветки.

- [ ] **Step 2: Verify desktop**

Проверить справа меню из девяти статей на списке и рядом с баннером на детальной странице; старого меню возле текста быть не должно.

- [ ] **Step 3: Verify mobile**

Проверить порядок блоков, бургер, отсутствие горизонтального переполнения и неинтерактивность пунктов меню.
