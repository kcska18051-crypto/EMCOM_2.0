# Production Content Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Удалить боковое меню страницы «Производство» и добавить серый прямоугольник между фрагментами рыбного текста.

**Architecture:** Страница сохраняет общую оболочку детальной страницы, но получает отдельный полноширинный контейнер `production-content-layout`. Встроенное изображение представлено семантическим серым плейсхолдером без интерактивности.

**Tech Stack:** HTML5, CSS, Node.js `node:test`, GitHub Pages.

## Global Constraints

- Главный баннер, хлебные крошки, заголовок, кнопка, шапка и подвал сохраняются.
- Боковое меню удаляется полностью.
- Серый прямоугольник находится между первым и последующими текстовыми фрагментами.
- Кнопка остаётся некликабельным `span`.
- Мобильная версия не создаёт горизонтального переполнения.
- Работа выполняется в `feature/production-content-layout` и объединяется с `main` после проверки.

---

### Task 1: Зафиксировать новую композицию тестом и реализовать её

**Files:**
- Modify: `tests/production-page.test.mjs`
- Modify: `production/index.html`
- Modify: `assets/css/prototype.css`

**Interfaces:**
- Consumes: существующие `service-detail-action`, `service-detail-description`, `media-placeholder`.
- Produces: `production-content-layout` и `data-production-inline-image`.

- [ ] **Step 1: Update the test first**

Заменить ожидание пяти пунктов меню следующими проверками:

```js
assert.doesNotMatch(html, /<aside\b/i);
assert.equal((html.match(/data-production-side-item/g) ?? []).length, 0);
assert.equal((html.match(/data-production-inline-image/g) ?? []).length, 1);
const firstText = html.indexOf("data-production-text-start");
const inlineImage = html.indexOf("data-production-inline-image");
const finalText = html.indexOf("data-production-text-end");
assert.ok(firstText < inlineImage && inlineImage < finalText);
```

Проверить наличие класса `production-content-layout` и мобильного правила для `.production-inline-image`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/production-page.test.mjs`

Expected: FAIL из-за существующего `aside` и отсутствия `data-production-inline-image`.

- [ ] **Step 3: Replace the two-column layout**

В `production/index.html` заменить `service-detail-layout` и `aside` на:

```html
<div class="production-content-layout">
  <article class="service-detail-content">
    <div class="service-detail-action">
      <span class="service-detail-calculation-control" data-production-calculation-control aria-disabled="true">Получить предварительный расчёт</span>
    </div>
    <section class="service-detail-description" data-production-description>
      <div data-production-text-start>
        <p class="service-detail-lead">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
      </div>
      <div class="production-inline-image media-placeholder" data-production-inline-image aria-label="Место для изображения в тексте"></div>
      <div data-production-text-end>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.</p>
        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
      </div>
    </section>
  </article>
</div>
```

- [ ] **Step 4: Add the minimal layout styles**

Добавить:

```css
.production-content-layout {
  width: min(calc(100% - 80px), 1370px);
  margin: 56px auto 0;
  padding-bottom: 96px;
}

.production-inline-image {
  width: 100%;
  margin: 36px 0;
  aspect-ratio: 16 / 6;
}
```

В `@media (max-width: 900px)` установить ширину `min(calc(100% - 48px), 1370px)`, верхний отступ `0` и нижний `72px`; прямоугольник сохраняет ширину `100%`.

- [ ] **Step 5: Bump the CSS cache key**

На всех готовых HTML-страницах заменить `prototype.css?v=20260817-5` на `prototype.css?v=20260817-6`. Обновить соответствующие ожидания во всех тестах.

- [ ] **Step 6: Run focused and full tests**

Run:

```powershell
node --test tests/production-page.test.mjs
node --test tests/*.test.mjs
```

Expected: все тесты PASS, 0 failures.

---

### Task 2: Опубликовать и проверить

**Files:**
- Verify: `production/index.html`
- Verify: `assets/css/prototype.css`
- Verify: `tests/*.test.mjs`

**Interfaces:**
- Consumes: проверенную ветку `feature/production-content-layout`.
- Produces: обновлённую страницу GitHub Pages.

- [ ] **Step 1: Upload and verify the feature branch**

Загрузить изменённые файлы через GitHub Contents API, клонировать свежую ветку во временную директорию и выполнить `node --test tests/*.test.mjs`.

Expected: 0 failures.

- [ ] **Step 2: Merge and verify main**

Объединить ветку с `main`, клонировать свежий `main` и снова выполнить полный набор тестов.

Expected: 0 failures, SHA соответствует результату слияния.

- [ ] **Step 3: Verify desktop GitHub Pages**

При ширине 1440 px проверить отсутствие `aside`, полноширинный контент, кнопку сверху справа и серый прямоугольник между текстовыми фрагментами.

- [ ] **Step 4: Verify mobile GitHub Pages**

При ширине 390 px проверить полную ширину кнопки и изображения, работу бургера и отсутствие горизонтального переполнения.

- [ ] **Step 5: Clean up the merged branch**

После успешной проверки удалить только `feature/production-content-layout`.
